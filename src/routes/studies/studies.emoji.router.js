import express from 'express';
import { studiesEmojiRepository, studiesCrudRepository } from '#repository';
import { NotFoundException } from '../../errors/notFoundException.js';
import { BadRequestException } from '../../errors/badRequestException.js';
import { validateId } from '../../utils/idValidate.js';
import { HTTP_STATUS, ERROR_MESSAGE } from '#constants';

export const studiesEmojiRouter = express.Router();

//METHOD:POST studies/:studyId/emojis
studiesEmojiRouter.post('/:studyId/emojis', async (req, res) => {
  const { studyId } = req.params;
  const { emojis } = req.body;

  validateId(studyId);

  // studyId 존재 여부 확인
  const study = await studiesCrudRepository.findStudyById(studyId);
  if (!study) {
    throw new NotFoundException(ERROR_MESSAGE.STUDY_NOT_FOUND);
  }

  // 입력 검증
  if (!emojis || !Array.isArray(emojis) || emojis.length === 0) {
    throw new BadRequestException(ERROR_MESSAGE.EMOJI_REQUIRED);
  }

  const emojiCounts = await studiesEmojiRepository.createEmojis(emojis, studyId);

  res.status(HTTP_STATUS.CREATED).json({ emojis: emojiCounts });
});
