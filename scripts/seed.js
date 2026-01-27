import { PrismaClient } from '#generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';
import { ulid } from 'ulid';

const xs = (n) => Array.from({ length: n }, (_, i) => i + 1);

const EMOJIS = ['🔥', '👍', '🌱', '💪', '✅', '🎯', '📚', '⭐'];
const BACKGROUNDS = ['#EAF2E1', '#F5E6D3', '#E3F2FD', '#FFF3E0', '#F3E5F5'];

const STUDY_DATA = [
  { title: '연우의 개발공장', nickname: 'J', description: 'Slow and steady wins the race', totalPoint: 310 },
  { title: '알고리즘 루틴', nickname: 'KM', description: '매일 1문제씩 풀기', totalPoint: 85 },
  { title: '영어 마스터', nickname: 'Tom', description: '토익 900점 목표!', totalPoint: 220 },
  { title: '독서 클럽', nickname: '민지', description: '한 달에 책 4권 읽기', totalPoint: 150 },
  { title: '코딩 부트캠프', nickname: 'Alex', description: '프론트엔드 개발자 되기', totalPoint: 480 },
  { title: '취준생 스터디', nickname: '준영', description: '함께 취업 준비해요', totalPoint: 95 },
  { title: 'SQLD 자격증', nickname: 'DB마스터', description: 'SQL 개발자 자격증 취득', totalPoint: 180 },
  { title: '아침 기상 챌린지', nickname: '얼리버드', description: '매일 6시 기상!', totalPoint: 420 },
  { title: 'React 스터디', nickname: 'JSLover', description: '리액트 마스터하기', totalPoint: 275 },
  { title: '정보처리기사', nickname: '수험생A', description: '필기+실기 한번에', totalPoint: 130 },
  { title: '다이어트 클럽', nickname: '헬스보이', description: '여름까지 -10kg', totalPoint: 340 },
  { title: 'AWS 자격증', nickname: '클라우드', description: 'SAA 자격증 취득', totalPoint: 200 },
  { title: '일본어 공부방', nickname: 'にほんご', description: 'JLPT N2 목표', totalPoint: 165 },
  { title: '코테 준비반', nickname: '백준러', description: '골드 달성하기', totalPoint: 390 },
  { title: 'CS 스터디', nickname: 'OS마스터', description: '면접 대비 CS 공부', totalPoint: 115 },
  { title: '사이드 프로젝트', nickname: '개발새발', description: '포트폴리오 만들기', totalPoint: 445 },
  { title: '논문 읽기 모임', nickname: '석사생', description: '주 1회 논문 리뷰', totalPoint: 70 },
  { title: '디자인 패턴', nickname: 'GoF', description: '클린 코드 작성하기', totalPoint: 250 },
  { title: '영어 회화반', nickname: 'English', description: '원어민처럼 말하기', totalPoint: 185 },
  { title: '주식 공부방', nickname: '워렌버핏', description: '경제 공부하기', totalPoint: 320 },
];

const HABIT_DATA = [
  '알고리즘 1문제 풀기',
  '영어 단어 30개 암기',
  '책 30분 읽기',
  '운동 30분 하기',
  'TIL 작성하기',
];

const makeStudyInput = (data, index) => {
  const date = new Date();
  date.setDate(date.getDate() - (STUDY_DATA.length - index)); // 오래된 순으로 생성
  return {
    id: ulid(),
    title: data.title,
    nickname: data.nickname,
    description: data.description,
    backgroundImage: BACKGROUNDS[index % BACKGROUNDS.length],
    password: 'test1234',
    totalPoint: data.totalPoint,
    createdAt: date,
  };
};

const makeHabitInputsForStudy = (studyId, count, startIndex, studyIndex) =>
  xs(count).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - (20 - studyIndex) + i); // 스터디별로 다른 날짜
    return {
      id: ulid(),
      studyId,
      title: HABIT_DATA[(startIndex + i) % HABIT_DATA.length],
      startDate: date,
      endDate: null,
      createdAt,
    };
  });

const makeHabitLogInputsForHabit = (habitId, count) =>
  xs(count).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    return {
      id: ulid(),
      habitId,
      logDate: date,
    };
  });

const makeFocusSessionInputsForStudy = (studyId, count, studyIndex) =>
  xs(count).map((_, i) => {
    const targetTimes = [30, 45, 60, 90, 120];
    const targetTime = targetTimes[i % targetTimes.length];
    const activeTime = targetTime - Math.floor(Math.random() * 15);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - (15 - studyIndex) - i);
    createdAt.setHours(9 + i * 2, 0, 0, 0); // 시간도 다르게
    return {
      id: ulid(),
      studyId,
      targetTime,
      activeTime: Math.max(10, activeTime),
      pauseUsed: i % 2 === 0,
      earnedPoints: Math.floor(activeTime / 10) * 10,
      createdAt,
    };
  });

const makeEmojiInputsForStudy = (studyId, count, studyIndex) =>
  xs(count).map((_, i) => {
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 10) - studyIndex);
    createdAt.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), 0, 0);
    return {
      id: ulid(),
      studyId,
      emoji: EMOJIS[i % EMOJIS.length],
      createdAt,
    };
  });

const resetDb = (prisma) =>
  prisma.$transaction([
    prisma.habitLog.deleteMany(),
    prisma.habit.deleteMany(),
    prisma.focusSession.deleteMany(),
    prisma.studyEmoji.deleteMany(),
    prisma.study.deleteMany(),
  ]);

const seedStudies = async (prisma) => {
  const data = STUDY_DATA.map((s, i) => makeStudyInput(s, i));
  const ids = data.map((s) => s.id);

  await prisma.study.createMany({ data });
  return prisma.study.findMany({
    where: { id: { in: ids } },
    select: { id: true },
  });
};

const seedHabits = async (prisma, studies) => {
  const habitCounts = [3, 2, 2, 1, 3];
  const data = studies.flatMap((s, i) =>
    makeHabitInputsForStudy(s.id, habitCounts[i] || 2, i * 2, i)
  );

  const ids = data.map((h) => h.id);
  await prisma.habit.createMany({ data });
  return prisma.habit.findMany({
    where: { id: { in: ids } },
    select: { id: true },
  });
};

const seedHabitLogs = async (prisma, habits) => {
  const logCounts = [5, 3, 4, 2, 5, 1, 3, 4, 2, 5, 3];
  const data = habits.flatMap((h, i) =>
    makeHabitLogInputsForHabit(h.id, logCounts[i % logCounts.length])
  );

  await prisma.habitLog.createMany({ data });
};

const seedFocusSessions = async (prisma, studies) => {
  const sessionCounts = [5, 3, 4, 2, 6];
  const data = studies.flatMap((s, i) =>
    makeFocusSessionInputsForStudy(s.id, sessionCounts[i] || 3, i)
  );

  await prisma.focusSession.createMany({ data });
};

const seedEmojis = async (prisma, studies) => {
  const emojiCounts = [12, 7, 9, 5, 15];
  const data = studies.flatMap((s, i) =>
    makeEmojiInputsForStudy(s.id, emojiCounts[i] || 5, i)
  );

  await prisma.studyEmoji.createMany({ data });
};

async function main(prisma) {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('⚠️  프로덕션 환경에서는 시딩을 실행하지 않습니다');
  }

  console.log('🌱 시딩 시작...');

  await resetDb(prisma);
  console.log('✅ 기존 데이터 삭제 완료');

  const studies = await seedStudies(prisma);
  console.log(`✅ ${studies.length}개의 스터디 생성 완료`);

  const habits = await seedHabits(prisma, studies);
  console.log(`✅ ${habits.length}개의 습관 생성 완료`);

  await seedHabitLogs(prisma, habits);
  console.log('✅ 습관 로그 생성 완료');

  await seedFocusSessions(prisma, studies);
  console.log('✅ 집중 세션 생성 완료');

  await seedEmojis(prisma, studies);
  console.log('✅ 이모지 생성 완료');

  console.log('✅ 데이터 시딩 완료');
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

main(prisma)
  .catch((e) => {
    console.error('❌ 시딩 에러:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
