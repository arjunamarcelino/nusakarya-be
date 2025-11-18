import { DoneFuncWithErrOrRes, FastifyInstance, FastifyPluginOptions } from 'fastify'
import LicenseController from '#app/modules/license/license_controller'
import LicenseSchema from '#app/modules/license/license_schema'
import { verifyPrivyToken } from '#app/middlewares/auth_middleware'

export default function (app: FastifyInstance, _: FastifyPluginOptions, done: DoneFuncWithErrOrRes) {
  app.post('/license', {
    schema: LicenseSchema.create,
    preHandler: verifyPrivyToken,
  }, LicenseController.create)

  app.get('/license', {
    schema: LicenseSchema.getAll,
    preHandler: verifyPrivyToken,
  }, LicenseController.getAll)

  done()
}

