import express from 'express';
import { studiesCrudRepository } from '#repository';
import { NotFoundException } from '../../errors/notFoundException.js';
import { prisma } from '#db/prisma.js';
import { BadRequestException } from '../../errors/badRequestException.js';
import { validateId } from '../../utils/idValidate.js';
import { HTTP_STATUS, ERROR_MESSAGE } from '#constants';
import { validate } from '#middlewares/validate.middleware.js';
import { createStudyValidator } from '#validators';

export const studiesCrudRouter = express.Router();

//METHOD:GET studies?
studiesCrudRouter.get('/', async (req, res) => {
  const { pageSize, search, sort, cursor } = req.query;

  if (cursor) {
    validateId(cursor);
    const exists = await prisma.study.findUnique({ where: { id: cursor } });
    if (!exists) {
      throw new BadRequestException(ERROR_MESSAGE.INVALID_CURSOR);
    }
  }
  const studiesList = await studiesCrudRepository.findStudiesPaged({
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

//METHOD:GET studies/:studyId
studiesCrudRouter.get('/:studyId', async (req, res) => {
  const { studyId } = req.params;
  validateId(studyId);
  const studyItem = await studiesCrudRepository.findStudyById(studyId);

  if (!studyItem) {
    throw new NotFoundException(ERROR_MESSAGE.STUDY_DETAIL_NOT_FOUND);
  }

  res.json(studyItem);
});

//METHOD:POST /studies
studiesCrudRouter.post('/', validate(createStudyValidator), async (req, res) => {
  const newStudy = await studiesCrudRepository.createStudy(req.body);

  res.status(HTTP_STATUS.CREATED).json({ study: newStudy });
});
