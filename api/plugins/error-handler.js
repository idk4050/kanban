import fp from 'fastify-plugin'

/** @param {import('../kanban').Router} router */
async function customErrorHandler(router, defaultErrorHandler) {
  router.setErrorHandler((err, req, reply) => {
    let mappedErr = err
    if (router.isDatabaseError(err)) {
      mappedErr = router.mapDatabaseError(err)
    }
    defaultErrorHandler(mappedErr, req, reply)
  })
}

export default async parentRouter =>
  fp(router => customErrorHandler(router, parentRouter.errorHandler), {
    name: 'customErrorHandler',
    decorators: {
      fastify: ['isDatabaseError', 'mapDatabaseError'],
    },
    dependencies: ['database'],
  })(parentRouter)
