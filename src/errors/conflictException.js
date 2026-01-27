import { HttpException } from './httpException.js';

// 409 Conflict 전용 예외 (중복/충돌 상황용: 예) 이메일 중복)
export class ConflictException extends HttpException {
  constructor(message = '이미 존재하는 데이터입니다', code = 'CONFLICT') {
    super(message, 409, code);
  }
}
