import { HttpException } from './httpException.js';
import { ERROR_MESSAGE, HTTP_STATUS } from '#constants';

// 409 Conflict 전용 예외 (중복/충돌 상황용: 예) 이메일 중복)
export class ConflictException extends HttpException {
  constructor(message = ERROR_MESSAGE.CONFLICT, code = 'CONFLICT') {
    super(message, HTTP_STATUS.CONFLICT, code);
  }
}
