import { DoneFuncWithErrOrRes, FastifyInstance, FastifyPluginOptions } from 'fastify'
import AuthController from '#app/modules/auth/auth_controller'
import { verifyPrivyToken } from '#app/middlewares/auth_middleware'

export default function (app: FastifyInstance, _: FastifyPluginOptions, done: DoneFuncWithErrOrRes) {
  app.post('/auth/verify', AuthController.verify)

  app.get('/auth/me', { preHandler: verifyPrivyToken }, AuthController.me)

  done()
}

