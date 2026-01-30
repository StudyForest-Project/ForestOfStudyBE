import { HttpException } from './httpException.js';
import { ERROR_MESSAGE, HTTP_STATUS } from '#constants';

// 400 Bad Request 전용 예외 (요청값/검증 오류용)
export class BadRequestException extends HttpException {
  constructor(message = ERROR_MESSAGE.BAD_REQUEST, code = 'VALIDATION_ERROR') {
    super(message, HTTP_STATUS.BAD_REQUEST, code);
  }
}
