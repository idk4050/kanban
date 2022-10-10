import fp from 'fastify-plugin'

/** @param {import('../kanban').Router} router */
async function swag(router) {
  router.register(import('@fastify/swagger'), {
    mode: 'dynamic',
    routePrefix: '/swagger',
    swagger: {
      info: {
        title: 'Kanban API',
        version: '1.0.0',
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here',
      },
      schemes: ['https', 'http'],
      consumes: ['application/json'],
      produces: ['application/json', 'text/html'],
    },
    uiConfig: {
      deepLinking: false,
    },
    transformStaticCSP: header => header,
    staticCSP: true,
    exposeRoute: true,
  })
}

export default fp(swag, {
  name: 'swag',
})
