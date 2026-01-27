import { HttpException } from './httpException.js';

// 401 Unauthorized 전용 예외 (인증 실패용)
export class UnauthorizedException extends HttpException {
  constructor(message = '인증이 필요합니다', code = 'UNAUTHORIZED') {
    super(message, 401, code);
  }
}
