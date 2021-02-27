import { ifElse, gt, apply, reduce, slice, subtract, pipe, add, __, map, prop, always, lte, identity, call, compose } from 'ramda'
import { IAttempt } from '../shared-types/email'
import { getDLDistance } from './string-similarity'

enum ENTROPY_WEIGHTS {
    ATTEMPT = 5,
    RETRY_TOO_QUICK = 10,
    UNSIMILAR = 5
}

export const FLAG_THRESHOLD = 30

export const isFlagged = (score: number): boolean => {
    return score > FLAG_THRESHOLD
}

const twoOrMore: (arr: any[]) => boolean = pipe(
    prop('length'),
    gt(__, 2)
)

const addForAttempt = always(ENTROPY_WEIGHTS.ATTEMPT)

const tooFast = pipe(
    map(prop('time')),
    apply(subtract),
    gt(__, -500),
    ifElse(identity, always(ENTROPY_WEIGHTS.RETRY_TOO_QUICK), always(0))
)

const tooUnsimilar = pipe(
    map(prop('email')),
    apply(getDLDistance),
    gt(__, 2),
    ifElse(identity, always(ENTROPY_WEIGHTS.UNSIMILAR), always(0))
)

const calculateEntropyScore = pipe(
    slice(-2, Infinity),
    lastTwo => reduce(
        (acc, fn) => add(call(fn, lastTwo), acc),
        0,
        [addForAttempt, tooFast, tooUnsimilar]
    )
)

export const getScore: (attempts: IAttempt[]) => number = ifElse(
    twoOrMore,
    calculateEntropyScore,
    always(ENTROPY_WEIGHTS.ATTEMPT)
)