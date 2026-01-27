import { prisma } from '#db/prisma.js';

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
      emojis: {
        select: { emoji: true },
      },
    },
  });

  const hasNextPage = studies.length > pageSize;
  const items = hasNextPage ? studies.slice(0, -1) : studies;

  const itemsWithEmojiCounts = items.map((study) => {
    const emojiCounts = study.emojis.reduce((acc, { emoji }) => {
      acc[emoji] = (acc[emoji] || 0) + 1;
      return acc;
    }, {});
    // emojiCounts (결과값)
    //{ '🔥': 12, '👍': 7, '🌱': 3 }
    console.log(emojiCounts, 'emojiCounts');

    const emojis = Object.entries(emojiCounts).map(([emoji, count]) => ({
      emoji,
      count,
    }));
    console.log(emojis, 'emojis');
    return { ...study, emojis };
  });
  // Object.entries() → [키, 값] 배열로 변환
  //[['🔥', 12], ['👍', 7], ['🌱', 3]]

  // .map() → 객체 배열로 변환
  //[
  //  { emoji: '🔥', count: 12 },
  // { emoji: '👍', count: 7 },
  //{ emoji: '🌱', count: 3 }
  //]

  return {
    success: true,
    items: itemsWithEmojiCounts,
    pageInfo: {
      pageSize,
      nextCursor: hasNextPage ? items[items.length - 1].id : null,
    },
  };
}

export const studiesRepository = {
  findStudiesPaged,
};
