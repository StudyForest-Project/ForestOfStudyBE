import { HttpException } from './httpException.js';
import { ERROR_MESSAGE, HTTP_STATUS } from '#constants';

// 401 Unauthorized 전용 예외 (인증 실패용)
export class UnauthorizedException extends HttpException {
  constructor(message = ERROR_MESSAGE.UNAUTHORIZED, code = 'UNAUTHORIZED') {
    super(message, HTTP_STATUS.UNAUTHORIZED, code);
  }
}
