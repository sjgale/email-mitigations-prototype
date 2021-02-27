import { Plugin, Server, Request, ResponseToolkit } from '@hapi/hapi'
import { pipe, andThen, ifElse } from 'ramda'
import { buildSuccessResponse, buildFailureResponse } from './response'
import { getScore } from './entropy-score'
import { addAttemptToSession, getOrInitSession, getSession, sessionExists, updateCachedSession, updateFlag } from './sessions'
import { IAttempt, ISession } from '../shared-types/email'


const emailPlugin: Plugin<undefined> = {
    name: 'app/email',
    register: async (server: Server) => {
        server.route([
            {
                method: ['GET'],
                path: '/email',
                handler: emailPageHandler
            },
            {
                method: ['GET', 'POST'],
                path: '/email/{email}',
                handler: emailValidationHandler
            }
        ])
    }
}

const emailPageHandler = async (request: Request, h: ResponseToolkit) => {
    const session = await getOrInitSession(request.info.remoteAddress)
    console.log('The session:', JSON.stringify(session))
    updateCachedSession(session)
    return h.view('index',
        {
            title: 'Email Scoring',
            description: 'Proof of concept for scoring emails',
            bootstrap: { session }
        }
    )
}

const getScoreForAttempts = (session: ISession) => {
    const updatedSession = {
        ...session,
        score: session.score + getScore(session.attempts)
    }
    return updatedSession
}

const parseRequest = (request: Request): { ip: string, email: string, time: number } => ({
    ip: request.info?.remoteAddress,
    email: request.params?.email,
    time: Date.now()
})

const flaggedSession = (session: ISession) => session.flagged

const buildSessionResponse = (attempt: IAttempt) => pipe(
    addAttemptToSession(attempt),
    getScoreForAttempts,
    updateFlag,
    updateCachedSession,
    buildSuccessResponse
)

const emailValidationHandler = async (request: Request, h: ResponseToolkit) => {
    const { ip, email, time } = parseRequest(request)

    const response = await pipe(
        getSession,
        andThen(
            ifElse(
                sessionExists,
                ifElse(
                    flaggedSession,
                    buildSuccessResponse,
                    buildSessionResponse({ email, time })
                ),
                buildFailureResponse("No session for request")
            )
        )
    )(ip)

    return h.response(response).code(200)
}

export default emailPlugin