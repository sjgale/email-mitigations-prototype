import { curry } from 'ramda'

const buildSuccessResponse = (data: any) => { 
    return {
        success: true,
        data
    }
}
const buildFailureResponse = curry((message: string, data: any) => ({
    success: false,
    message,
    data
}))

export { buildSuccessResponse, buildFailureResponse }