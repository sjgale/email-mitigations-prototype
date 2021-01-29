import { ISession, IAttempt } from '../shared-types/email'
import { set, get, mget, zrevrange, incrby, zadd } from './redis'
import { curry, __, ifElse, pipe, isNil, identity, andThen } from 'ramda'

const sessionExists = async (ip: string): Promise<boolean> => {
    const session = await get(`session:${ip}:flagged`)
    return session !== null
}

const getSession = async (ip: string): Promise<ISession | undefined> => {
    const [flagged, score] = await mget(`session:${ip}:flagged`, `session:${ip}:score`)
    const { lastAttempt, timeOfLastAttempt } = await zrevrange(`session:${ip}:attempts`, 0, 0, "WITHSCORES")
    return {
        ip,
        flagged: flagged === 'true',
        score: Number(score),
        incrementScoreBy: 0,
        attempts: [
            {
                email: lastAttempt,
                time: Number(timeOfLastAttempt)
            }
        ]
    }
}

const updateSessionFlag = async (session: ISession): Promise<ISession> => {
    await set(`session:${session.ip}:flagged`, session.flagged ? 'true' : 'false')
    return session
}

const incrementCachedScore = async (session: ISession): Promise<ISession> => {
    const score = await incrby(`session:${session.ip}:score`, session.incrementScoreBy)
    const updatedSession = Object.assign({}, session, {
        score,
        incrementScoreBy: 0
    })
    return updatedSession
}

const cacheMostRecentAttempt = (session: ISession): ISession => {
    if (session.attempts?.length >= 1) {
        const attempt = session.attempts[session.attempts.length - 1]
        zadd(`session:${session.ip}:attempts`, { [attempt?.email]: attempt?.time })
    }
    return session
}

const addAttemptToSession = curry(
    (attempt: IAttempt, session: ISession): ISession =>
        ({ ...session, attempts: [...session.attempts, attempt] })
)

const buildNewSession = (ip: string): () => ISession => () => {
    console.log('creating a new session!')
    const newSession = {
        ip,
        flagged: false,
        score: 0,
        incrementScoreBy: 0,
        attempts: [{
            email: null,
            time: Date.now()
        }]
    }
    return newSession
}

const getOrInitSession = async (ip: string): Promise<ISession> => pipe(
    getSession,
    andThen(ifElse(
        isNil,
        buildNewSession(ip),
        identity
    ))
)

export {
    getOrInitSession,
    getSession,
    sessionExists,
    updateSessionFlag,
    incrementCachedScore,
    cacheMostRecentAttempt,
    addAttemptToSession
}