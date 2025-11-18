import { FastifyInstance } from 'fastify'

import MainRoute from '#app/modules/main/main_route'
import AuthRoute from '#app/modules/auth/auth_route'
import KaryaRoute from '#app/modules/karya/karya_route'
import LicenseRoute from '#app/modules/license/license_route'

export default function (app: FastifyInstance) {
  app.register(MainRoute)
  app.register(AuthRoute)
  app.register(KaryaRoute)
  app.register(LicenseRoute)
}
