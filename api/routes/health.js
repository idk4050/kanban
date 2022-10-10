/** @param {import('../kanban').Router} router */
export default async router => {
  router.get('/health', (req, reply) => reply.code(200).send())
}
