const swaggerConfigSetup = (host: string) => ({
  mode: 'dynamic',
  swagger: {
    info: {
      title: 'Starter API Documentation',
      description: 'API documentation for Starter Backend',
      version: '1.0.0',
      contact: {
        name: 'API Support',
      },
    },
    host: `${host}`,
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'Auth', description: 'The endpoints for the authentication' },
      { name: 'Item', description: 'The endpoints for the item' },
      { name: 'Health', description: 'The endpoints for the health check' },
    ],
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description:
          'Enter the token with the `Bearer: ` prefix, e.g. "Bearer abcde12345".',
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  exposeRoute: true,
  hideUntagged: false,
})

export default swaggerConfigSetup
