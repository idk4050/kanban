import Keycloak from 'keycloak-connect'
import fp from 'fastify-plugin'
import getPort from 'get-port'
import { exec } from 'child_process'
import { join } from 'desm'

/** @param {import('../kanban').Router} router */
async function auth(router) {
  const config = router.config.auth

  let host = config.host
  let port = config.port

  if (config.inMemory) {
    host = 'localhost'
    port = await getPort()
    const seed = join(import.meta.url, '..', config.seedFile)
    exec(
      [
        `podman run --rm -p ${port}:8080`,
        `-v ${seed}:/opt/keycloak/data/import/seed.json`,
        '-e KEYCLOAK_ADMIN=keycloak',
        '-e KEYCLOAK_ADMIN_PASSWORD=keycloak',
        'quay.io/keycloak/keycloak:19.0.3',
        'start-dev --import-realm',
      ].join(' ')
    )
  }
  const client = new Keycloak(
    {},
    {
      'auth-server-url': `${host}:${port}`,
      realm: config.realm,
      resource: config.client,
      credentials: {
        secret: config.clientSecret,
      },
    }
  )
  router.decorate('auth', client)
}

export default fp(auth, {
  name: 'auth',
  decorators: {
    fastify: ['config'],
  },
})
