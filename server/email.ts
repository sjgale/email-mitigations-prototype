import { Plugin, Server, Request, ResponseToolkit } from '@hapi/hapi'
import { pipe, path, andThen, ifElse } from 'ramda'
import { buildSuccessResponse, buildFailureResponse } from './response'
import { getScore } from './entropy-score'
import { addAttemptToSession, cacheMostRecentAttempt, getOrInitSession, getSession, incrementCachedScore, sessionExists, updateSessionFlag } from './sessions'
import { ISession } from '../shared-types/email'


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
    const session =  await getOrInitSession(request.info.remoteAddress)
    console.log('The session:', session)
    return h.view('index',
        {
            title: 'Email Scoring',
            description: 'Proof of concept for scoring emails',
            bootstrap: { session }
        }
    )
}

const getScoreForAttempts = (session: ISession) => {
    const scoreForLatestAttempt = getScore(session.attempts)
    const updatedSession = {
        ...session,
        incrementScoreBy: scoreForLatestAttempt
    }
    return updatedSession
}

const emailValidationHandler = async (request: Request, h: ResponseToolkit) => {
    const ip = path(['info', 'remoteAddress'], request)
    const email = path(['params', 'email'], request)
    const time = Date.now()

    const response = await ifElse(
        sessionExists,
        pipe(
            getSession,
            andThen(addAttemptToSession({email, time})),
            andThen(cacheMostRecentAttempt),
            andThen(getScoreForAttempts),
            andThen(incrementCachedScore),
            andThen(updateSessionFlag),
            andThen(buildSuccessResponse)
        ),
        buildFailureResponse("No session for request")
    )(ip)

    return h.response(response).code(200)
}

export default emailPlugin