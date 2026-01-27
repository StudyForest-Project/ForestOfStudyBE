import { studiesRepository } from '#repository';
import express from 'express';
import { NotFoundException } from '../../errors/notFoundException.js';
import { prisma } from '#db/prisma.js';
import { BadRequestException } from '../../errors/badRequestException.js';

export const studiesRouter = express.Router();

//METHOD:GET studies?
studiesRouter.get('/', async (req, res) => {
  const { pageSize, search, sort, cursor } = req.query;

  if (cursor) {
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

//METHOD:GET studies/:id
studiesRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const studyItem = await studiesRepository.findStudyById(id);

  res.json(studyItem);
});
