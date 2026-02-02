import z from 'zod';
import { ERROR_MESSAGE } from '#constants';

// 스터디 생성
export const createStudyValidator = z.object({
  nickname: z
    .string({ message: ERROR_MESSAGE.NICKNAME_REQUIRED })
    .trim()
    .min(1, ERROR_MESSAGE.NICKNAME_MIN),
  title: z
    .string({ message: ERROR_MESSAGE.TITLE_REQUIRED })
    .trim()
    .min(1, ERROR_MESSAGE.TITLE_MIN),
  description: z
    .string({ message: ERROR_MESSAGE.DESCRIPTION_REQUIRED })
    .trim()
    .min(1, ERROR_MESSAGE.DESCRIPTION_MIN),
  backgroundImage: z
    .string({ message: ERROR_MESSAGE.BACKGROUND_IMAGE_REQUIRED })
    .trim()
    .min(1, ERROR_MESSAGE.BACKGROUND_IMAGE_MIN),
  password: z
    .string({ message: ERROR_MESSAGE.PASSWORD_REQUIRED })
    .trim()
    .min(1, ERROR_MESSAGE.PASSWORD_MIN),
});

export const updateStudyValidator = z
  .object({
    nickname: z.string().trim().min(1, ERROR_MESSAGE.NICKNAME_MIN).optional(),
    title: z.string().trim().min(1, ERROR_MESSAGE.TITLE_MIN).optional(),
    description: z.string().trim().min(1, ERROR_MESSAGE.DESCRIPTION_MIN).optional(),
    backgroundImage: z
      .string()
      .trim()
      .min(1, ERROR_MESSAGE.BACKGROUND_IMAGE_MIN)
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: ERROR_MESSAGE.UPDATE_FIELD_REQUIRED,
  });
