import { studiesRepository } from '#repository';
import express from 'express';
import { NotFoundException } from '../../errors/notFoundException.js';
import { prisma } from '#db/prisma.js';
import { BadRequestException } from '../../errors/badRequestException.js';
import { validateId } from '../../utils/idValidate.js';

export const studiesRouter = express.Router();

//METHOD:GET studies?
studiesRouter.get('/', async (req, res) => {
  const { pageSize, search, sort, cursor } = req.query;

  if (cursor) {
    // 형식 검증 먼저 (DB 조회 전에 id 체크)
    validateId(cursor);
    const exists = await prisma.study.findUnique({ where: { id: cursor } });
    if (!exists) {
      throw new BadRequestException('유효하지 않은 cursor입니다');
    }
  }
  const studiesList = await studiesRepository.findStudiesPaged({
    pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
    search,
    sort,
    cursor,
  });

  if (!studiesList) {
    throw new NotFoundException('스터디 리스트가 존재하지 않습니다.');
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
    throw new NotFoundException('스터디 상세페이지를 찾을 수 없습니다.');
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
    throw new NotFoundException('스터디를 찾을 수 없습니다.');
  }

  // 입력 검증
  if (!emojis || !Array.isArray(emojis) || emojis.length === 0) {
    throw new BadRequestException('이모지를 입력해주세요.');
  }

  const emojiCounts = await studiesRepository.createEmojis(emojis, studyId);

  res.status(201).json({ emojis: emojiCounts });
});
