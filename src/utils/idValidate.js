import { BadRequestException } from '../errors/badRequestException.js';

const ulidRegex = /^[0-9A-Z]{26}$/;

export function validateId(id) {
  if (!ulidRegex.test(id)) {
    throw new BadRequestException('잘못된 ID 형식입니다');
  }
}
