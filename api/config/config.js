import envSchema from 'env-schema'
import withFormats from 'ajv-formats'
import { join } from 'desm'

const schema = {
  type: 'object',
  required: ['API_PORT', 'API_ALLOWED_ORIGINS', 'DB_DIALECT'],
  properties: {
    API_PORT: { type: 'integer' },
    API_ALLOWED_ORIGINS: {
      type: 'string',
      separator: ',',
    },
    API_TLS_CERT_FILE: { type: 'string' },
    API_TLS_KEY_FILE: { type: 'string' },

    DB_DIALECT: { type: 'string' },
    DB_FILE: { type: 'string' },
    DB_HOST: { type: 'string' },
    DB_PORT: { type: 'integer' },
    DB_NAME: { type: 'string' },
    DB_USER: { type: 'string' },
    DB_PASSWORD: { type: 'string' },
    DB_MIGRATE: { type: 'boolean' },
    DB_SEED: { type: 'boolean' },
  },
}

const config = envSchema({
  schema,
  env: true,
  expandEnv: true,
  dotenv: {
    path: join(import.meta.url, '.env'),
  },
  ajv: {
    customOptions: ajv => withFormats(ajv),
  },
})

export default {
  api: {
    port: Number(config.API_PORT),
    allowedOrigins: new Set([...config.API_ALLOWED_ORIGINS].map(String)),
    tls: {
      certFile: config.API_TLS_CERT_FILE,
      keyFile: config.API_TLS_KEY_FILE,
    },
  },
  database: {
    dialect: String(config.DB_DIALECT),
    file: config.DB_FILE ? String(config.DB_FILE) : undefined,
    host: String(config.DB_HOST),
    port: Number(config.DB_PORT),
    name: String(config.DB_NAME),
    user: String(config.DB_USER),
    password: String(config.DB_PASSWORD),
    migrate: Boolean(config.DB_MIGRATE),
    seed: Boolean(config.DB_SEED),
  },
}
