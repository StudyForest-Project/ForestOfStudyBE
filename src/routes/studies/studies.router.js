import express from 'express';
import { studiesRepository } from '#repository';
import { NotFoundException } from '../../errors/notFoundException.js';
import { prisma } from '#db/prisma.js';
import { BadRequestException } from '../../errors/badRequestException.js';
import { validateId } from '../../utils/idValidate.js';
import { HTTP_STATUS, ERROR_MESSAGE } from '#constants';
import { validate } from '#middlewares/validate.middleware.js';
import { createStudyValidator, updateStudyValidator } from '#validators';
import { requireStudyAccess } from '#middlewares/auth.middleware.js';

export const studiesRouter = express.Router();

//스터디 리스트
//METHOD:GET studies?
studiesRouter.get('/', async (req, res) => {
  const { pageSize, search, sort, cursor } = req.query;

  if (cursor) {
    validateId(cursor);
    const exists = await prisma.study.findUnique({ where: { id: cursor } });
    if (!exists) {
      throw new BadRequestException(ERROR_MESSAGE.INVALID_CURSOR);
    }
  }
  const studiesList = await studiesRepository.findPaged({
    pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
    search,
    sort,
    cursor,
  });

  if (!studiesList) {
    throw new NotFoundException(ERROR_MESSAGE.STUDY_LIST_NOT_FOUND);
  }

  res.json(studiesList);
});

// 스터디 상세조회
//METHOD:GET studies/:studyId
studiesRouter.get('/:studyId', async (req, res) => {
  const { studyId } = req.params;
  validateId(studyId);
  const studyItem = await studiesRepository.findById(studyId);

  if (!studyItem) {
    throw new NotFoundException(ERROR_MESSAGE.STUDY_DETAIL_NOT_FOUND);
  }

  res.json(studyItem);
});

// 스터디 동록
//METHOD:POST /studies
studiesRouter.post('/', validate(createStudyValidator), async (req, res) => {
  const newStudy = await studiesRepository.create(req.body);

  res.status(HTTP_STATUS.CREATED).json({ study: newStudy });
});

// 스터디 수정
//METHOD:PATCH /studies/:studyId
studiesRouter.patch(
  '/:studyId',
  requireStudyAccess,
  validate(updateStudyValidator),
  async (req, res) => {
    const { studyId } = req.params;

    const patchStudy = await studiesRepository.update(studyId, req.body);
    res.status(HTTP_STATUS.OK).json({ study: patchStudy });
  },
);

// 스터디 삭제
//METHOD:DELETE /studies/:studyId
studiesRouter.delete('/:studyId', requireStudyAccess, async (req, res) => {
  const { studyId } = req.params;
  const deletedStudy = await studiesRepository.remove(studyId);
  res.status(HTTP_STATUS.OK).json({ success: true, study: deletedStudy });
});
