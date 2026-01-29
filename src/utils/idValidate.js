import { BadRequestException } from '../errors/badRequestException.js';
import { ERROR_MESSAGE } from '#constants';

const ulidRegex = /^[0-9A-Z]{26}$/;

export function validateId(id) {
  if (!ulidRegex.test(id)) {
    throw new BadRequestException(ERROR_MESSAGE.INVALID_ID_FORMAT);
  }
}
