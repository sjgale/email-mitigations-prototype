import { ISession, IAttempt } from '../shared-types/email'
import { set, get, mget, zrevrange, incrby, zadd } from './redis'
import { curry, __, ifElse, pipe, isNil, identity, andThen, not } from 'ramda'
import { isFlagged } from './entropy-score'

const sessionExists = (session: ISession | undefined): boolean => !!session

const getSession = async (ip: string): Promise<ISession | undefined> => {
    const [flagged, score] = await mget(`session:${ip}:flagged`, `session:${ip}:score`)
    const lastCachedAttempt = await zrevrange(`session:${ip}:attempts`, 0, 0, "WITHSCORES")
    if (not(isNil(flagged))) {
        const [lastEmail, lastTimestamp] = Object.entries(lastCachedAttempt)[0]
        return {
            ip,
            flagged: flagged === 'true',
            _score: Number(score),
            score: Number(score),
            attempts: [
                {
                    email: lastEmail,
                    time: Number(lastTimestamp)
                }
            ]
        }
    }
}

const updateCachedSession = (session: ISession): ISession => pipe(
    updateCachedFlag,
    incrementCachedScore,
    cacheMostRecentAttempt
)(session)

const updateCachedFlag = (session: ISession): ISession => {
    set(`session:${session.ip}:flagged`, session.flagged ? 'true' : 'false')
    return session
}

const updateFlag = (session: ISession): ISession => {
    return { ...session, flagged: isFlagged(session.score) }
}

const incrementCachedScore = (session: ISession): ISession => {
    let score = session.score - session._score
    if (score > 0) {
        incrby(`session:${session.ip}:score`, Number(score))
    }
    return session
}

const cacheMostRecentAttempt = (session: ISession): ISession => {
    if (session.attempts?.length > 0) {
        const attempt = session.attempts[session.attempts.length - 1]
        zadd(
            `session:${session.ip}:attempts`,
            { [attempt?.email]: attempt?.time },
            { nxxx: "NX" }
        )
    }
    return session
}

const addAttemptToSession = curry(
    (attempt: IAttempt, session: ISession): ISession =>
        ({ ...session, attempts: [...session.attempts, attempt] })
)

const buildNewSession = (ip: string) => (): ISession => {
    const newSession = {
        ip,
        flagged: false,
        score: 0,
        _score: 0,
        attempts: [{
            email: null,
            time: Date.now()
        }]
    }
    return newSession
}

const getOrInitSession = (ip: string): Promise<ISession> => pipe(
    getSession,
    andThen(
        ifElse(
            sessionExists,
            identity,
            buildNewSession(ip)
        )
    )
)(ip)

export {
    getOrInitSession,
    getSession,
    sessionExists,
    updateCachedFlag,
    incrementCachedScore,
    cacheMostRecentAttempt,
    addAttemptToSession,
    updateFlag,
    updateCachedSession
}