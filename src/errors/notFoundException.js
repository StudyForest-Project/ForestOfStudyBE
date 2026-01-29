import { HttpException } from './httpException.js';
import { ERROR_MESSAGE } from '#constants';

// 404 Not Found 전용 예외 (요청한 리소스를 찾지 못했을 때)
export class NotFoundException extends HttpException {
  constructor(message = ERROR_MESSAGE.NOT_FOUND, code = 'NOT_FOUND') {
    super(message, 404, code);
  }
}
