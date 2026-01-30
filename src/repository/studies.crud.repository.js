import { prisma } from '#db/prisma.js';
import { transformEmojiCounts } from '../utils/emoji.utils.js';
import { transformHabitWeek } from '../utils/habit.utils.js';
import { ulid } from 'ulid';
import bcrypt from 'bcrypt';

// 모든 스터디 조회 및 페이지네이션
async function findStudiesPaged({
  pageSize = 6,
  search = '',
  sort = 'recent',
  cursor = null,
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

  if (!studyDetail) return null;

  const { habits, emojis, ...studyInfo } = studyDetail;

  return {
    study: studyInfo,
    emojis: transformEmojiCounts(emojis),
    habitWeek: transformHabitWeek(habits),
  };
}

// 스터디 생성
async function createStudy(data) {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  return await prisma.study.create({
    data: {
      id: ulid(),
      nickname: data.nickname,
      title: data.title,
      description: data.description,
      backgroundImage: data.backgroundImage,
      password: hashedPassword,
    },
  });
}

export const studiesCrudRepository = {
  findStudiesPaged,
  findStudyById,
  createStudy,
};
