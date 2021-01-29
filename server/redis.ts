
import { Tedis } from 'tedis'

const tedis = new Tedis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD
})

export const set = async (key: string, value: string) => {
    return await tedis.set(key, value)
}

export const get = async (key: string) => {
    return await tedis.get(key)
}

export const mget = async (...keys: [string, ...string[]]) => {
    return await tedis.mget(...keys)
}

export const zrevrange = async (key: string, start: number, stop: number, withScores?: 'WITHSCORES') => {
    return await tedis.zrevrange(key, start, stop, withScores)
}

export const incrby = async (key: string, increment: number) => {
    return await tedis.incrby(key, increment)
}

export const zadd = async (key: string, values: {[propName: string]: number}, options: any) => {
    return await tedis.zadd(key, values, options)
}