import { prisma } from '#db/prisma.js';
import { transformEmojiCounts } from '../utils/emoji.utils.js';
import { ulid } from 'ulid';

// 스터디 이모지 등록
async function createEmojis(emojis, studyId) {
  await prisma.StudyEmoji.createMany({
    data: emojis.map((emoji) => ({
      id: ulid(),
      studyId: studyId,
      emoji: emoji,
    })),
  });

  const allEmojis = await prisma.StudyEmoji.findMany({
    where: { studyId },
    select: { emoji: true },
  });

  return transformEmojiCounts(allEmojis);
}

export const studiesEmojiRepository = {
  createEmojis,
};
