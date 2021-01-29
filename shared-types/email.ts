export interface ISession {
    ip: string
    flagged: boolean
    score: number
    incrementScoreBy: number
    attempts: IAttempt[]
}

export interface IAttempt {
    email: string
    time: number
}

interface ISuccessResponse<T> {
    success: true
    data: T
}

interface IFailureResponse {
    success: true
    message: string
}

type IResponse<T> = ISuccessResponse<T> | IFailureResponse

export type IValidationResult = IResponse<ISession>