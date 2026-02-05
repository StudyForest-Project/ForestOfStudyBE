import { PrismaClient } from '#generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';
import { ulid } from 'ulid';
import bcrypt from 'bcrypt';

const xs = (n) => Array.from({ length: n }, (_, i) => i + 1);
const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const EMOJIS = ['🔥', '👍', '🌱', '💪', '✅', '🎯', '📚', '⭐'];

// 프론트엔드와 동일한 배경 값
const BACKGROUNDS = [
  '#E1EDDE',
  '#FFF1CC',
  '#E0F1F5',
  '#FDE0E9',
  '/src/assets/img/bg_img_1.jpg',
  '/src/assets/img/bg_img_2.jpg',
  '/src/assets/img/bg_img_3.jpg',
  '/src/assets/img/bg_img_4.jpg',
];

// 닉네임 (최대 3자)
const NICKNAMES = [
  'J', 'KM', '민지', '준영', '수진', '지훈', '서연', '도윤',
  '하늘', '별이', '코딩', '열공', '백준', '취준', '대학',
  '직장', '개발', '디자', '석사', '박사',
];

// 타이틀 (최대 6자) - 조합 시 "백준러의 면접 준비반" (11자) 이하
const TITLES = [
  '개발 공장', '알고리즘', '영어 공부', '독서 클럽', '코딩 캠프',
  '취준 스터디', 'SQLD', '기상 챌린지', 'React', '정처기',
  '다이어트', 'AWS', '일본어', '코테 준비', 'CS 스터디',
  '사이드PJ', '논문 스터디', '디자인', '영어 회화', '주식 공부',
  'TS 스터디', 'Node.js', 'Spring', 'Python', 'Java',
  '면접 준비', '포폴 제작', 'Git', 'Docker', 'DevOps',
];

const DESCRIPTIONS = [
  'Slow and steady wins the race',
  '매일 1문제씩 풀기',
  '목표를 향해 달려가자!',
  '함께 공부해요',
  '꾸준함이 답이다',
  '오늘도 화이팅!',
  '작은 습관이 큰 변화를 만든다',
  '같이 성장해요',
  '포기하지 말자',
  '열심히 하는 중!',
];

const HABIT_TITLES = [
  '알고리즘 1문제 풀기',
  '영어 단어 30개 암기',
  '책 30분 읽기',
  '운동 30분 하기',
  'TIL 작성하기',
  '코드 리뷰하기',
  '강의 1개 듣기',
  '뉴스레터 읽기',
  '블로그 글 쓰기',
  '명상 10분',
];

// 이번 주 월~목 날짜 (동적으로 계산)
const getThisWeekDates = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0(일) ~ 6(토)
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  monday.setHours(0, 0, 0, 0);

  return [0, 1, 2, 3].map((i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return date;
  });
};

const THIS_WEEK_DATES = getThisWeekDates();

const generateStudyData = (count) =>
  xs(count).map(() => ({
    title: `${randomPick(NICKNAMES)}의 ${randomPick(TITLES)}`,
    nickname: randomPick(NICKNAMES),
    description: randomPick(DESCRIPTIONS),
    totalPoint: randomInt(50, 500),
  }));

const STUDY_DATA = generateStudyData(60);

const makeStudyInput = async (data, index) => {
  const date = new Date();
  date.setDate(date.getDate() - (STUDY_DATA.length - index));
  const hashedPassword = await bcrypt.hash('test1234', 10);
  return {
    id: ulid(),
    title: data.title,
    nickname: data.nickname,
    description: data.description,
    backgroundImage: randomPick(BACKGROUNDS),
    password: hashedPassword,
    totalPoint: data.totalPoint,
    createdAt: date,
  };
};

// 각 스터디당 6개의 습관 생성
const makeHabitInputsForStudy = (studyId) =>
  xs(6).map((_, i) => {
    const startDate = new Date(THIS_WEEK_DATES[0]); // 이번 주 월요일
    startDate.setHours(0, 0, 0, 0);
    const createdAt = new Date(THIS_WEEK_DATES[0]);
    createdAt.setHours(9 + i, 0, 0, 0);
    return {
      id: ulid(),
      studyId,
      title: HABIT_TITLES[i % HABIT_TITLES.length],
      startDate,
      endDate: null,
      createdAt,
    };
  });

// 2월 2일 ~ 2월 5일 사이의 로그 생성 (최소 3개 이상)
const makeHabitLogInputsForHabit = (habitId) => {
  // 4일 중 랜덤하게 3개 또는 4개 선택
  const count = Math.random() < 0.5 ? 3 : 4;
  const indices = [0, 1, 2, 3];

  // 셔플 후 count개 선택
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const selectedIndices = indices.slice(0, count);

  return selectedIndices.map((idx) => {
    const logDate = new Date(THIS_WEEK_DATES[idx]);
    logDate.setHours(0, 0, 0, 0);
    return {
      id: ulid(),
      habitId,
      logDate,
    };
  });
};

// 포커스 세션 생성 (각 스터디당 10~20개, 세션당 최대 8점)
const makeFocusSessionInputsForStudy = (studyId) => {
  const sessionCount = randomInt(10, 20);
  return xs(sessionCount).map(() => {
    const targetTimes = [15, 30, 45, 60, 90, 120];
    const targetTime = randomPick(targetTimes);
    const activeTime = targetTime - randomInt(0, Math.floor(targetTime * 0.2));

    const createdAt = new Date(randomPick(THIS_WEEK_DATES));
    createdAt.setHours(randomInt(6, 23), randomInt(0, 59), 0, 0);

    return {
      id: ulid(),
      studyId,
      targetTime,
      activeTime: Math.max(5, activeTime),
      pauseUsed: Math.random() < 0.3,
      earnedPoints: randomInt(1, 8),
      createdAt,
    };
  });
};

const makeEmojiInputsForStudy = (studyId) => {
  const emojiCount = randomInt(5, 20);
  return xs(emojiCount).map(() => {
    const createdAt = new Date(randomPick(THIS_WEEK_DATES));
    createdAt.setHours(randomInt(0, 23), randomInt(0, 59), 0, 0);
    return {
      id: ulid(),
      studyId,
      emoji: randomPick(EMOJIS),
      createdAt,
    };
  });
};

const resetDb = (prisma) =>
  prisma.$transaction([
    prisma.habitLog.deleteMany(),
    prisma.habit.deleteMany(),
    prisma.focusSession.deleteMany(),
    prisma.studyEmoji.deleteMany(),
    prisma.study.deleteMany(),
  ]);

const seedStudies = async (prisma) => {
  const data = await Promise.all(STUDY_DATA.map((s, i) => makeStudyInput(s, i)));
  const ids = data.map((s) => s.id);

  await prisma.study.createMany({ data });
  return prisma.study.findMany({
    where: { id: { in: ids } },
    select: { id: true },
  });
};

const seedHabits = async (prisma, studies) => {
  const data = studies.flatMap((s) => makeHabitInputsForStudy(s.id));

  const ids = data.map((h) => h.id);
  await prisma.habit.createMany({ data });
  return prisma.habit.findMany({
    where: { id: { in: ids } },
    select: { id: true },
  });
};

const seedHabitLogs = async (prisma, habits) => {
  const data = habits.flatMap((h) => makeHabitLogInputsForHabit(h.id));
  await prisma.habitLog.createMany({ data });
  return data.length;
};

const seedFocusSessions = async (prisma, studies) => {
  const data = studies.flatMap((s) => makeFocusSessionInputsForStudy(s.id));
  await prisma.focusSession.createMany({ data });
  return data.length;
};

const seedEmojis = async (prisma, studies) => {
  const data = studies.flatMap((s) => makeEmojiInputsForStudy(s.id));
  await prisma.studyEmoji.createMany({ data });
  return data.length;
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
  console.log(`✅ ${habits.length}개의 습관 생성 완료 (스터디당 6개)`);

  const logCount = await seedHabitLogs(prisma, habits);
  console.log(`✅ ${logCount}개의 습관 로그 생성 완료 (2/2~2/5)`);

  const sessionCount = await seedFocusSessions(prisma, studies);
  console.log(`✅ ${sessionCount}개의 집중 세션 생성 완료`);

  const emojiCount = await seedEmojis(prisma, studies);
  console.log(`✅ ${emojiCount}개의 이모지 생성 완료`);

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
