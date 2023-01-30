import { withSwagger } from 'next-swagger-doc';

const swaggerHandler = withSwagger({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'AiInTheLoop Swagger',
      version: '0.1.0',
    },
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
            in: "header",
            name: "X-API-KEY"
        }
      }
    },
   security : [
  {
    ApiKeyAuth : []
  }]
},
  apiFolder: 'pages/api',
});
export default swaggerHandler();