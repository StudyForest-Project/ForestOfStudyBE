import express from 'express';
import { focusRepository } from '#repository';
import { validateId } from '../../utils/idValidate.js';
import { NotFoundException } from '../../errors/notFoundException.js';
import { BadRequestException } from '../../errors/badRequestException.js';
import { HTTP_STATUS } from '#constants';

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
    throw new NotFoundException('스터디를 찾을 수 없습니다.');
  }

  res.status(HTTP_STATUS.OK).json(studyInfo);
});

/**
 * [POST] 집중 완료 후 데이터 저장 및 포인트 업데이트
 * 경로: /studies/:id/focus-sessions
 */
focusRouter.post('/:studyId/focus-sessions', async (req, res) => {
  const { studyId } = req.params;
  const { targetTime, activeTime, pauseUsed } = req.body;

  validateId(studyId);

  if (typeof targetTime !== 'number' || targetTime <= 0) {
    throw new BadRequestException('targetTime은 0보다 큰 숫자여야 합니다.');
  }

  if (typeof activeTime !== 'number' || activeTime <= 0) {
    throw new BadRequestException('activeTime은 0보다 큰 숫자여야 합니다.');
  }

  if (typeof pauseUsed !== 'boolean') {
    throw new BadRequestException('pauseUsed는 true/false 중 하나여야 합니다.');
  }

  const result = await focusRepository.saveFocusResult({
    studyId,
    targetTime,
    activeTime,
    pauseUsed,
  });

  res.status(HTTP_STATUS.CREATED).json({
    message: '집중 기록이 저장되었습니다.',
    data: result,
  });
});
