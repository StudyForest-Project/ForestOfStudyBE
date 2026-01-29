import z from 'zod';
import { ERROR_MESSAGE } from '#constants';

// 집중 세션 생성
export const createFocusSessionValidator = z.object({
  targetTime: z
    .number({ message: ERROR_MESSAGE.TARGET_TIME_REQUIRED })
    .positive(ERROR_MESSAGE.TARGET_TIME_INVALID),
  activeTime: z
    .number({ message: ERROR_MESSAGE.ACTIVE_TIME_REQUIRED })
    .positive(ERROR_MESSAGE.ACTIVE_TIME_INVALID),
  pauseUsed: z.boolean({ message: ERROR_MESSAGE.PAUSE_USED_INVALID }),
});
