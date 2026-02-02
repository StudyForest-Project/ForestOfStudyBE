import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Study Forest API',
      version: '1.0.0',
    },
    servers: [{ url: 'http://localhost:8080' }],

    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'sf_access', // 너희가 쓰는 쿠키명으로 맞추기 (예: sf_access)
        },
      },
    },

    // (선택) 전체 API에 기본 적용하고 싶으면
    // security: [{ cookieAuth: [] }],
  },
  apis: ['src/swager/*.yaml'],
};

export const swaggerSpec = swaggerJSDoc(options);
