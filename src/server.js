import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { prisma } from '#db/prisma.js';
import { config } from '#config';
import { cors } from '#middlewares/cors.middleware.js';
import { routers } from './routes/index.js';
import { swaggerSpec } from './swager/swager.js';
import cookieParser from 'cookie-parser';
import { errorHandler } from '#middlewares/errorHandler.middleware.js';

const app = express();
const PORT = config.PORT;
//배포환경 프록시 설정
if (config.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// JSON 파싱 미들웨어
app.use(express.json());

app.use(cookieParser(config.COOKIE_SECRET));

// cors 체크
app.use(cors);

// Swagger UI
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      withCredentials: true,
    },
  }),
);

app.use('/', routers);

// 에러 핸들러
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(
    `[${config.NODE_ENV}] Server running at http://localhost:${PORT}`,
  );
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
