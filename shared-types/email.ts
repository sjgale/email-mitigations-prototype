export interface ISession {
    ip: string
    flagged: boolean
    score: number
    attempts: IAttempt[]
    _score: number
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