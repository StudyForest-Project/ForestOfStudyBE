import z from 'zod';
import { ERROR_MESSAGE } from '#constants';

// habit 생성
export const createHabitValidator = z.object({
  title: z
    .string({ message: ERROR_MESSAGE.HABIT_TITLE_REQUIRED })
    .trim()
    .min(1, ERROR_MESSAGE.HABIT_TITLE_MIN),
});

// habit 수정
export const updateHabitValidator = z
  .object({
    title: z.string().trim().min(1, ERROR_MESSAGE.HABIT_TITLE_MIN).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: ERROR_MESSAGE.UPDATE_FIELD_REQUIRED,
  });

// habit 토글
export const toggleHabitValidator = z.preprocess(
  (val) => val ?? {},
  z.object({
    checked: z.boolean({ error: ERROR_MESSAGE.HABIT_CHECKED_REQUIRED }),
  }),
);
