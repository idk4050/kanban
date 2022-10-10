import envSchema from 'env-schema'
import withFormats from 'ajv-formats'
import { join } from 'desm'

const schema = {
  type: 'object',
  required: ['API_PORT', 'API_ALLOWED_ORIGINS'],
  properties: {
    API_PORT: { type: 'integer' },
    API_ALLOWED_ORIGINS: {
      type: 'string',
      separator: ',',
    },
    API_TLS_CERT_FILE: { type: 'string' },
    API_TLS_KEY_FILE: { type: 'string' },
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
}
