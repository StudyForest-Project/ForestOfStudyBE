import express from 'express';
import { focusRepository } from '#repository';
import { validateId } from '../../utils/idValidate.js';
import { NotFoundException } from '../../errors/notFoundException.js';
import { HTTP_STATUS, ERROR_MESSAGE, SUCCESS_MESSAGE } from '#constants';
import { validate } from '#middlewares/validate.middleware.js';
import { createFocusSessionValidator } from '#validators';

export const focusRouter = express.Router();

/**
 * [GET] 집중 페이지 진입 시 정보 조회
 * 경로: /studies/:id/focus
 */
focusRouter.get('/:studyId/focus', async (req, res) => {
  const { studyId } = req.params;
  validateId(studyId);

  const studyInfo = await focusRepository.findFocusInfoByStudyId(studyId);

  if (!studyInfo) {
    throw new NotFoundException(ERROR_MESSAGE.STUDY_NOT_FOUND);
  }

  res.status(HTTP_STATUS.OK).json(studyInfo);
});

/**
 * [POST] 집중 완료 후 데이터 저장 및 포인트 업데이트
 * 경로: /studies/:id/focus-sessions
 */
focusRouter.post(
  '/:studyId/focus-sessions',
  validate(createFocusSessionValidator),
  async (req, res) => {
    const { studyId } = req.params;
    const { targetTime, activeTime, pauseUsed } = req.body;

    validateId(studyId);

    const result = await focusRepository.saveFocusResult({
      studyId,
      targetTime,
      activeTime,
      pauseUsed,
    });

    res.status(HTTP_STATUS.CREATED).json({
      message: SUCCESS_MESSAGE.FOCUS_SAVED,
      data: result,
    });
  }
);
