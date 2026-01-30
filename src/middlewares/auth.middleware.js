import { ERROR_MESSAGE } from '#constants';
import { UnauthorizedException } from '../errors/unauthorizedException.js';
import { hasStudyAccess } from '../utils/cookie.utils.js';
import { validateId } from '../utils/idValidate.js';

export const requireStudyAccess = (req, res, next) => {
  const { studyId } = req.params;
  validateId(studyId);

  if (!hasStudyAccess(req, studyId)) {
    throw new UnauthorizedException(ERROR_MESSAGE.UNAUTHORIZED);
  }
  next();
};
