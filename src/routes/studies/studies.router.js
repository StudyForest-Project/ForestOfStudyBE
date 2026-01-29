import { studiesRepository } from '#repository';
import express from 'express';
import { NotFoundException } from '../../errors/notFoundException.js';
import { prisma } from '#db/prisma.js';
import { BadRequestException } from '../../errors/badRequestException.js';
import { validateId } from '../../utils/idValidate.js';
import { HTTP_STATUS, ERROR_MESSAGE } from '#constants';
import { validate } from '#middlewares/validate.middleware.js';
import { createStudyValidator } from '#validators';

export const studiesRouter = express.Router();

//METHOD:GET studies?
studiesRouter.get('/', async (req, res) => {
  const { pageSize, search, sort, cursor } = req.query;

  if (cursor) {
    // 형식 검증 먼저 (DB 조회 전에 id 체크)
    validateId(cursor);
    const exists = await prisma.study.findUnique({ where: { id: cursor } });
    if (!exists) {
      throw new BadRequestException(ERROR_MESSAGE.INVALID_CURSOR);
    }
  }
  const studiesList = await studiesRepository.findStudiesPaged({
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
studiesRouter.get('/:studyId', async (req, res) => {
  const { studyId } = req.params;
  console.log(studyId);
  // 아이디 형식 체크
  validateId(studyId);
  const studyItem = await studiesRepository.findStudyById(studyId);

  if (!studyItem) {
    throw new NotFoundException(ERROR_MESSAGE.STUDY_DETAIL_NOT_FOUND);
  }

  res.json(studyItem);
});

//METHOD:POST studies/:studyId/emojis
studiesRouter.post('/:studyId/emojis', async (req, res) => {
  const { studyId } = req.params;
  const { emojis } = req.body;

  // 아이디 형식 체크
  validateId(studyId);

  // studyId 존재 여부 확인
  const study = await studiesRepository.findStudyById(studyId);
  if (!study) {
    throw new NotFoundException(ERROR_MESSAGE.STUDY_NOT_FOUND);
  }

  // 입력 검증
  if (!emojis || !Array.isArray(emojis) || emojis.length === 0) {
    throw new BadRequestException(ERROR_MESSAGE.EMOJI_REQUIRED);
  }

  const emojiCounts = await studiesRepository.createEmojis(emojis, studyId);

  res.status(HTTP_STATUS.CREATED).json({ emojis: emojiCounts });
});

//METHOD:POST /studies
studiesRouter.post('/', validate(createStudyValidator), async (req, res) => {
  const newStudy = await studiesRepository.createStudy(req.body);

  res.status(HTTP_STATUS.CREATED).json({ study: newStudy });
});
