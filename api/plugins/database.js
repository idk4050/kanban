import fp from 'fastify-plugin'
import * as knex from 'knex'
import pg from 'pg'
import pgErrors from 'pg-error-constants'
import { StatusCodes } from 'http-status-codes'
import databaseConfig from './database/config.js'

/** @param {import('../kanban').Router} router */
async function database(router) {
  const config = router.config.database
  const client = knex.default(databaseConfig(config))

  if (config.migrate) await client.migrate.latest()
  if (config.seed) await client.seed.run()

  router.decorate('database', client)

  switch (config.dialect) {
    case 'postgres':
      router
        .decorate('isDatabaseError', err => err instanceof pg.DatabaseError)
        .decorate('mapDatabaseError', mapPostgresError)
      break
    case 'sqlite':
      router
        .decorate(
          'isDatabaseError',
          err => err.code && err.code.startsWith('SQLITE_')
        )
        .decorate('mapDatabaseError', mapSqliteError)
      break
    default:
      throw new Error('unsupported database dialect')
  }
}

const DATABASE_ERROR = 'DATABASE_ERROR'

function mapPostgresError(err) {
  let message
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR

  if (err.code === pgErrors.UNIQUE_VIOLATION) {
    const entityName = err.table.replace(/s$/i, '').replace(/_/g, ' ')
    message = `${entityName} already exists`
    statusCode = StatusCodes.CONFLICT
  } else {
    message = `database error: ${err.message}`
  }
  return {
    code: DATABASE_ERROR,
    message,
    statusCode,
  }
}
function mapSqliteError(err) {
  let message
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR

  if (err.message.includes('SQLITE_CONSTRAINT: UNIQUE')) {
    message = 'already exists'
    statusCode = StatusCodes.CONFLICT
  } else {
    message = `database error: ${err.message.slice(
      err.message.indexOf('SQLITE_')
    )}`
  }
  return {
    code: DATABASE_ERROR,
    message,
    statusCode,
  }
}

export default fp(database, {
  name: 'database',
  decorators: {
    fastify: ['config'],
  },
})
