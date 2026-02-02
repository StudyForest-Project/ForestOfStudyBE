import { prisma } from '#db/prisma.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import { ulid } from 'ulid';

dayjs.extend(utc);
dayjs.extend(timezone);

const KST = 'Asia/Seoul';

// 오늘의 습관 목록 조회
async function findTodayHabits(studyId) {
  const study = await prisma.study.findUnique({
    where: { id: studyId },
    select: {
      habits: {
        where: { endDate: null },
        select: {
          id: true,
          title: true,
          logs: {
            select: {
              logDate: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!study) return null;

  const now = dayjs().tz(KST);
  const today = now.format('YYYY-MM-DD');
  const habits = study.habits.map((habit) => {
    // 오늘 날짜(KST)에 log가 있는지 확인
    const checked = habit.logs.some(
      (log) => dayjs(log.logDate).tz(KST).format('YYYY-MM-DD') === today,
    );

    return {
      habitId: habit.id,
      title: habit.title,
      checked,
    };
  });

  return {
    today,
    now: now.format('YYYY-MM-DDTHH:mm:ssZ'),
    habits,
  };
}

// 습관생성
async function create(body, studyId) {
  const { title } = body;
  const startDate = new Date(dayjs().tz(KST).format('YYYY-MM-DD'));

  const habitData = await prisma.habit.create({
    data: { id: ulid(), title, studyId, startDate },
  });
  return habitData;
}

//습관 수정
async function update(id, data) {
  return await prisma.habit.update({
    where: { id },
    data,
  });
}

//습관 삭제 (soft delete)
async function remove(id) {
  const endDate = new Date(dayjs().tz(KST).format('YYYY-MM-DD'));
  return await prisma.habit.update({
    where: { id },
    data: { endDate },
  });
}

//습관 토글
async function toggleLog(habitId, checked) {
  const today = new Date(dayjs().tz(KST).format('YYYY-MM-DD'));

  if (checked) {
    //로그없음 생성
    return await prisma.habitLog.upsert({
      where: { habitId_logDate: { habitId, logDate: today } },
      create: { id: ulid(), habitId, logDate: today },
      update: {}, // 있으면 아무것도 추가안함 upsert는 update필수!
    });
  } else {
    return await prisma.habitLog.deleteMany({
      where: { habitId, logDate: today },
    });
  }
}

export const habitsRepository = {
  findTodayHabits,
  create,
  update,
  remove,
  toggleLog,
};
