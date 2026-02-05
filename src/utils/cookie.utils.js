import { config } from '#config';

// const DAY_IN_MS = 24 * 60 * 60 * 1000;

// 스터디 접근 쿠키 삭제
export const clearStudyAccessCookie = (res, studyId) => {
  res.clearCookie(`study_${studyId}`, {
    path: '/',
    secure: config.NODE_ENV === 'production',
    sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
    signed: true,
  });
};

// 스터디 접근 쿠키 설정 (단일 인증 - 기존 쿠키 삭제 후 새 쿠키 발급)
export const setStudyAccessCookie = (req, res, studyId) => {
  // 기존 study_* 쿠키 모두 삭제
  const signedCookies = req.signedCookies || {};
  // console.log(req);
  Object.keys(signedCookies).forEach((key) => {
    if (key.startsWith('study_')) {
      const oldStudyId = key.replace('study_', '');
      clearStudyAccessCookie(res, oldStudyId);
    }
  });

  // 새 쿠키 설정
  res.cookie(`study_${studyId}`, 'authorized', {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
    signed: true,
  });
};

// 스터디 접근 쿠키 확인
export const hasStudyAccess = (req, studyId) => {
  console.log('=== 쿠키 디버깅 ===');
  console.log('req.signedCookies:', req.signedCookies);
  console.log('찾는 키:', `study_${studyId}`);
  console.log('값:', req.signedCookies[`study_${studyId}`]);
  console.log('==================');

  return req.signedCookies[`study_${studyId}`] === 'authorized';
};
