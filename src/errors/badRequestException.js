import { HttpException } from './httpException.js';

// 400 Bad Request 전용 예외 (요청값/검증 오류용)
export class BadRequestException extends HttpException {
  constructor(message = '잘못된 요청입니다', code = 'VALIDATION_ERROR') {
    super(message, 400, code);
  }
}
