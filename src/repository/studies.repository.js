import { prisma } from '#db/prisma.js';
import { emoji } from 'zod';
import { transformEmojiCounts } from '../utils/emoji.utils.js';
import { transformHabitWeek } from '../utils/habit.utils.js';
import { ulid } from 'ulid';
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
// 모든 스터디 조회 및 페이지네이션 하나로
async function findStudiesPaged({
  pageSize = 6, // 한 페이지당 개수
  search = '',
  sort = 'recent',
  cursor = null, // 빈 문자열보다 null이 명확
}) {
  const where = search
    ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};

  const getOrderBy = (sort) => {
    switch (sort) {
      case 'recent':
        return { createdAt: 'desc' };
      case 'oldest':
        return { createdAt: 'asc' };
      case 'mostPoints':
        return { totalPoint: 'desc' };
      case 'leastPoints':
        return { totalPoint: 'asc' };
      default:
        return { createdAt: 'desc' };
    }
  };

  const orderBy = getOrderBy(sort);

  // 다음페이지 확인용으로 1개더 가지고 온다음
  // skip으로 1개 버림
  const studies = await prisma.study.findMany({
    take: pageSize + 1,
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1,
    }),
    where,
    orderBy,
    select: {
      id: true,
      title: true,
      nickname: true,
      description: true,
      backgroundImage: true,
      totalPoint: true,
      createdAt: true,
      updatedAt: true,
      emojis: {
        select: { emoji: true },
      },
    },
  });

  const hasNextPage = studies.length > pageSize;
  const items = hasNextPage ? studies.slice(0, -1) : studies;

  const itemsWithEmojiCounts = items.map((study) => ({
    ...study,
    emojis: transformEmojiCounts(study.emojis),
  }));

  return {
    success: true,
    items: itemsWithEmojiCounts,
    pageInfo: {
      pageSize,
      nextCursor: hasNextPage ? items[items.length - 1].id : null,
    },
  };
}

// 스터디 상세조회
async function findStudyById(id) {
  const studyDetail = await prisma.study.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      nickname: true,
      description: true,
      backgroundImage: true,
      totalPoint: true,
      createdAt: true,
      updatedAt: true,
      emojis: {
        select: { emoji: true },
      },
      habits: {
        select: {
          id: true,
          title: true,
          logs: {
            select: {
              id: true,
              logDate: true,
            },
          },
        },
      },
    },
  });

  // habits 원본 제거하고 구조 정리
  const { habits, emojis, ...studyInfo } = studyDetail;

  return {
    study: studyInfo,
    emojis: transformEmojiCounts(emojis),
    habitWeek: transformHabitWeek(habits),
  };
}
async function createStudy(data) {
  return await prisma.study.create({
    data: {
      id: ulid(),
      title: data.studyName,
      nickname: data.nickname,
      description: data.intro,
      backgroundImage: data.background,
      totalPoint: 0,
    },
  });
}

//스터디 이모지 등록
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

export const studiesRepository = {
  findStudiesPaged,
  findStudyById,
  createEmojis,
};
