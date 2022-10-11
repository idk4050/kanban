import databaseConfig from './config.js'
import config from '../../config/config.js'

const knexConfig = databaseConfig(config.database)

export default {
  development: knexConfig,
  staging: knexConfig,
  production: knexConfig,
}
