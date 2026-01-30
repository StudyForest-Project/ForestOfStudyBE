import { prisma } from '#db/prisma.js';
import bcrypt from 'bcrypt';

// 비밀번호 검증
async function verifyPassword(studyId, password) {
  const study = await prisma.study.findUnique({
    where: { id: studyId },
    select: { password: true },
  });

  if (!study) {
    return false;
  }

  return await bcrypt.compare(password, study.password);
}

export const studiesAuthRepository = {
  verifyPassword,
};
