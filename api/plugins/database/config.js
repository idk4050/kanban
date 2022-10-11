import { join } from 'desm'
import * as knex from 'knex'

/**
 * @param {typeof import('../config/config').default.database} config
 * @returns {knex.Knex.Config}
 */
export default config => {
  let client = config.dialect
  switch (client) {
    case 'postgres':
      client = 'pg'
      break
    case 'sqlite':
      client = 'sqlite3'
      break
    default:
      throw new Error('unsupported database dialect')
  }
  return {
    client: client,
    connection: config.file
      ? {
          filename: config.file,
          flags: ['OPEN_URI', 'OPEN_SHAREDCACHE'],
        }
      : {
          host: config.host,
          port: config.port,
          database: config.name,
          user: config.user,
          password: config.password,
        },
    migrations: {
      tableName: 'migrations',
      directory: join(import.meta.url, 'migrations'),
    },
    seeds: {
      directory: join(import.meta.url, 'seeds'),
    },
    useNullAsDefault: true,
  }
}
