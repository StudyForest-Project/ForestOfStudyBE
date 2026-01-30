import { config } from '#config';

// const DAY_IN_MS = 24 * 60 * 60 * 1000;

// 스터디 접근 쿠기 설정
export const setStudyAccessCookie = (res, studyId) => {
  res.cookie(`study_${studyId}`, 'authorized', {
    httpOnly: true, // JavaScript로 접근 불가 (XSS 방지)
    secure: config.NODE_ENV === 'production', // HTTPS에서만 전송
    sameSite: 'lax', // 크로스 사이트 요청 제한 (CSRF 방지)
    // maxAge: 7 * DAY_IN_MS, // 7일 -> 이속성 없으면 브라우저 켜져있는동안만 쿠키유지
    path: '/', // 모든 경로에서 쿠키 전송
    signed: true, // 위변조 방지
  });
};

// 스터디 접근 쿠키 확인
export const hasStudyAccess = (req, studyId) => {
  console.log('=== 쿠키 디버깅 ===');
  console.log('req.cookies:', req.cookies); // 일반 쿠키
  console.log('req.signedCookies:', req.signedCookies); // 서명된 쿠키
  console.log('찾는 키:', `study_${studyId}`);
  console.log('값:', req.signedCookies[`study_${studyId}`]);
  console.log('==================');

  return req.signedCookies[`study_${studyId}`] === 'authorized';
};

//스터디 접근 쿠기 삭제

export const clearStudyAccessCookie = (res, studyId) => {
  res.clearCookie(`study_${studyId}`, {
    path: '/',
    secure: config.NODE_ENV === 'production',
    sameSite: 'lax',
    signed: true, // ✅ 삭제도 signed로
  });
};
