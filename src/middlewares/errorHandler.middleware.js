import { Prisma } from '#generated/prisma/client.ts';
import { HttpException } from '../errors/httpException.js';
import { isDevelopment } from '../config/config.js';

export const errorHandler = (err, req, res, _next) => {
  // HttpException(또는 HttpException을 상속한 클래스)로 만들어진 인스턴스 처리
  if (err instanceof HttpException) {
    return res.status(err.statusCode).json({
      error: {
        status: err.statusCode,
        code: err.code,
        message: err.message,
      },
    });
  }

  // Prisma 에러 처리
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002: Unique constraint 위반
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: {
          status: 409,
          code: 'CONFLICT',
          message: '이미 존재하는 데이터입니다.',
        },
      });
    }
    // P2025: Record not found
    if (err.code === 'P2025') {
      return res.status(404).json({
        error: {
          status: 404,
          code: 'NOT_FOUND',
          message: '데이터를 찾을 수 없습니다.',
        },
      });
    }
    // 그 외 Prisma 에러
    return res.status(400).json({
      error: {
        status: 400,
        code: 'DATABASE_ERROR',
        message: isDevelopment
          ? `DB 에러: ${err.code}`
          : '요청을 처리할 수 없습니다.',
      },
    });
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      error: {
        status: 400,
        code: 'VALIDATION_ERROR',
        message: '잘못된 요청입니다.',
      },
    });
  }

  // 기타 예상치 못한 에러
  const errorResponse = {
    error: {
      status: 500,
      code: 'INTERNAL_ERROR',
      message: 'Internal Server Error',
    },
  };

  if (isDevelopment) {
    errorResponse.error.details = err.message;
  }

  return res.status(500).json(errorResponse);
};
