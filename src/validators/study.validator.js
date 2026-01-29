import z from 'zod';
import { ERROR_MESSAGE } from '#constants';

// 스터디 생성
export const createStudyValidator = z.object({
  nickname: z
    .string({ message: ERROR_MESSAGE.NICKNAME_REQUIRED })
    .min(1, ERROR_MESSAGE.NICKNAME_MIN),
  title: z
    .string({ message: ERROR_MESSAGE.TITLE_REQUIRED })
    .min(1, ERROR_MESSAGE.TITLE_MIN),
  description: z
    .string({ message: ERROR_MESSAGE.DESCRIPTION_REQUIRED })
    .min(1, ERROR_MESSAGE.DESCRIPTION_MIN),
  backgroundImage: z
    .string({ message: ERROR_MESSAGE.BACKGROUND_IMAGE_REQUIRED })
    .min(1, ERROR_MESSAGE.BACKGROUND_IMAGE_MIN),
  password: z
    .string({ message: ERROR_MESSAGE.PASSWORD_REQUIRED })
    .min(1, ERROR_MESSAGE.PASSWORD_MIN),
});
