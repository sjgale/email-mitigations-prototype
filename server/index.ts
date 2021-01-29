import Hapi, { Server } from '@hapi/hapi'
import Vision from '@hapi/vision'
import Inert from '@hapi/inert'
import Handlebars from 'handlebars'
import Dotenv from 'dotenv'
import * as Path from 'path'

import emailPlugin from './email'

Dotenv.config()

const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST
})

const createServer = async (): Promise<Server> => {

    await server.register(Vision)
    server.views({
        engines: {
            html: Handlebars
        },
        relativeTo: __dirname,
        path: 'templates'
    })

    server.register(Inert)
    server.route({
        method: 'GET',
        path: '/public/{param*}',
        handler: {
            directory: {
                path: Path.resolve(__dirname, '../', 'dist/client')
            }
        }
    })

    await server.register([
        emailPlugin
    ])

    await server.initialize()

    return server
}

process.on('unhandledRejection', (err) => {
    console.log(err)
    process.exit(1)
})

process.on('uncaughtException', err => {
    console.log(err)
    process.exit(1)
  })

createServer().then((server) => {
    server.start()
    console.log('Server running on %s', server.info.uri)
})