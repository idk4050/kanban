import * as fastifyCors from '@fastify/cors'
import fp from 'fastify-plugin'

/** @param {import('../kanban').Router} router */
async function cors(router) {
  const config = router.config.api

  router.register(fastifyCors.default, () => (req, callback) => {
    /** @type {fastifyCors.FastifyCorsOptions} */
    const options = {
      origin: false,
    }
    if (config.allowedOrigins.has(req.headers.origin)) {
      options.origin = req.headers.origin
    }
    callback(null, options)
  })
}

export default fp(cors, {
  name: 'cors',
  decorators: {
    fastify: ['config'],
  },
})
