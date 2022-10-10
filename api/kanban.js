import fastify from 'fastify'
import autoload from '@fastify/autoload'
import config from './config/config.js'
import { join } from 'desm'
import fs from 'fs'

/**
 * @typedef {import('fastify').FastifyInstance & {
 *   config: typeof config
 * }} Router
 */

export default async () => {
  const router = fastify({
    logger: true,
    requestTimeout: 10000,
    keepAliveTimeout: 10000,
    connectionTimeout: 10000,
    http2SessionTimeout: 10000,
    https: config.api.tls.certFile
      ? {
          cert: fs.readFileSync(config.api.tls.certFile),
          key: fs.readFileSync(config.api.tls.keyFile),
        }
      : undefined,
  })

  await router
    .decorate('config', config)
    .register(import('@fastify/helmet'))
    .register(import('@fastify/sensible'))
    .register(import('@fastify/compress'))
    .register(autoload, {
      dir: join(import.meta.url, 'plugins'),
      maxDepth: 0,
    })
  await router.register(autoload, {
    dir: join(import.meta.url, 'routes'),
    options: { prefix: '/api' },
  })

  try {
    await router.listen({
      host: '0.0.0.0',
      port: config.api.port,
    })
  } catch (err) {
    router.log.error(err)
    process.exit(1)
  }
}
