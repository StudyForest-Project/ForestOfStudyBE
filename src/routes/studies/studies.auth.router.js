import express from 'express';
import { studiesAuthRepository } from '#repository';
import { validateId } from '../../utils/idValidate.js';
import { HTTP_STATUS, ERROR_MESSAGE } from '#constants';
import { UnauthorizedException } from '../../errors/unauthorizedException.js';
import { BadRequestException } from '../../errors/badRequestException.js';
import { setStudyAccessCookie } from '../../utils/cookie.utils.js';

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

  const isValid = await studiesAuthRepository.verifyPassword(studyId, password);

  // 비밀번호 불일치
  if (!isValid) {
    throw new UnauthorizedException(ERROR_MESSAGE.PASSWORD_WRONG);
  }

  // 쿠키 발급
  setStudyAccessCookie(res, studyId);

  res.status(HTTP_STATUS.OK).json({ ok: true });
});

// TEST 1) 쿠키가 있나 확인
// GET /studies/:studyId/test-access
// studiesAuthRouter.get('/:studyId/test-access', (req, res) => {
//   const { studyId } = req.params;
//   console.log('hasStudyAccess:', hasStudyAccess(req, studyId));
//   return res.status(200).json({
//     ok: hasStudyAccess(req, studyId),
//     key: `study_${studyId}`,
//     signedValue: req.signedCookies?.[`study_${studyId}`] ?? null,
//   });
// });

// TEST 2) 쿠키 삭제 후 확인용
// POST /studies/:studyId/test-clear
// studiesAuthRouter.post('/:studyId/test-clear', (req, res) => {
//   const { studyId } = req.params;

//   clearStudyAccessCookie(res, studyId);

//   return res.status(200).json({ ok: true });
// });
