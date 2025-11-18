import { DoneFuncWithErrOrRes, FastifyInstance, FastifyPluginOptions } from 'fastify'
import KaryaController from '#app/modules/karya/karya_controller'
import KaryaSchema from '#app/modules/karya/karya_schema'
import { verifyPrivyToken } from '#app/middlewares/auth_middleware'

export default function (app: FastifyInstance, _: FastifyPluginOptions, done: DoneFuncWithErrOrRes) {
  app.post('/karya', {
    schema: KaryaSchema.create,
    preHandler: verifyPrivyToken,
  }, KaryaController.create)

  app.get('/karya', {
    schema: KaryaSchema.getAll,
    preHandler: verifyPrivyToken,
  }, KaryaController.getAll)

  done()
}

