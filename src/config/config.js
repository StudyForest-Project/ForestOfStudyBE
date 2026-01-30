import z from 'zod';
import { flattenError } from 'zod/v4/core';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.coerce.number().min(1000).max(65535).default(5001),
  DATABASE_URL: z.url(),
  COOKIE_SECRET: z.string().min(20), //쿠키 서명확인
});

const parseEnvironment = () => {
  try {
    return envSchema.parse({
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      DATABASE_URL: process.env.DATABASE_URL,
      COOKIE_SECRET: process.env.COOKIE_SECRET,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const flatten = flattenError(error);
      console.log('환경변수 검증 실패', flatten);
    }
    console.log(error);
    process.exit(1);
  }
};

export const config = parseEnvironment();
export const isDevelopment = config.NODE_ENV === 'development';
export const isProduction = config.NODE_ENV === 'production';
console.log(config, 'config');
console.log(config.NODE_ENV, 'ENV');
console.log(config.PORT, 'ENV');
