import express from 'express';
import { studiesRepository } from '#repository';
import { validateId } from '../../utils/idValidate.js';
import { HTTP_STATUS, ERROR_MESSAGE } from '#constants';
import { UnauthorizedException } from '../../errors/unauthorizedException.js';
import { BadRequestException } from '../../errors/badRequestException.js';
import { setStudyAccessCookie, hasStudyAccess } from '../../utils/cookie.utils.js';

export const studiesAuthRouter = express.Router();

//METHOD:POST studies/:studyId/verify-password
studiesAuthRouter.post('/:studyId/verify-password', async (req, res) => {
  const { studyId } = req.params;
  const { password } = req.body;

  validateId(studyId);

  // 비밀번호 입력 여부 확인
  if (!password) {
    throw new BadRequestException(ERROR_MESSAGE.PASSWORD_MIN);
  }

  const isValid = await studiesRepository.verifyPassword(studyId, password);

  // 비밀번호 불일치
  if (!isValid) {
    throw new UnauthorizedException(ERROR_MESSAGE.PASSWORD_WRONG);
  }

  // 쿠키 발급 (기존 study_* 쿠키 삭제 후 새 쿠키 발급)
  setStudyAccessCookie(req, res, studyId);

  res.status(HTTP_STATUS.OK).json({ ok: true });
});

// 스터디 접근 권한 확인
//METHOD:GET studies/:studyId/check-access
studiesAuthRouter.get('/:studyId/check-access', (req, res) => {
  const { studyId } = req.params;

  validateId(studyId);

  const isAccessible = hasStudyAccess(req, studyId);

  res.status(HTTP_STATUS.OK).json({ ok: isAccessible });
});
