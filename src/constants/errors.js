// Prisma 에러 코드 상수
export const PRISMA_ERROR = {
  UNIQUE_CONSTRAINT: 'P2002',
  RECORD_NOT_FOUND: 'P2025',
};

// 에러 메시지 상수
export const ERROR_MESSAGE = {
  // 공통
  BAD_REQUEST: '잘못된 요청입니다',
  UNAUTHORIZED: '인증이 필요합니다',
  NOT_FOUND: '아이템을 찾을 수 없습니다',
  CONFLICT: '이미 존재하는 데이터입니다',
  INVALID_ID_FORMAT: '잘못된 ID 형식입니다',
  INVALID_CURSOR: '유효하지 않은 cursor입니다',
  INVALID_INPUT: '입력값이 올바르지 않습니다.',
  VALIDATION_FAILED: '유효성 검사에 실패했습니다.',

  // Study 관련
  STUDY_NOT_FOUND: '스터디를 찾을 수 없습니다.',
  STUDY_LIST_NOT_FOUND: '스터디 리스트가 존재하지 않습니다.',
  STUDY_DETAIL_NOT_FOUND: '스터디 상세페이지를 찾을 수 없습니다.',

  // Emoji 관련
  EMOJI_REQUIRED: '이모지를 입력해주세요.',

  // Focus 관련
  TARGET_TIME_REQUIRED: 'targetTime은 숫자여야 합니다.',
  TARGET_TIME_INVALID: 'targetTime은 0보다 큰 숫자여야 합니다.',
  ACTIVE_TIME_REQUIRED: 'activeTime은 숫자여야 합니다.',
  ACTIVE_TIME_INVALID: 'activeTime은 0보다 큰 숫자여야 합니다.',
  PAUSE_USED_INVALID: 'pauseUsed는 true/false 중 하나여야 합니다.',

  // Study 생성 관련
  NICKNAME_REQUIRED: '닉네임은 필수입니다.',
  NICKNAME_MIN: '닉네임을 입력해주세요.',
  TITLE_REQUIRED: '스터디 이름은 필수입니다.',
  TITLE_MIN: '스터디 이름을 입력해주세요.',
  DESCRIPTION_REQUIRED: '소개는 필수입니다.',
  DESCRIPTION_MIN: '소개를 입력해주세요.',
  BACKGROUND_IMAGE_REQUIRED: '배경 이미지는 필수입니다.',
  BACKGROUND_IMAGE_MIN: '배경 이미지를 선택해주세요.',
  PASSWORD_REQUIRED: '비밀번호는 필수입니다.',
  PASSWORD_MIN: '비밀번호를 입력해주세요.',
};

// 성공 메시지 상수
export const SUCCESS_MESSAGE = {
  FOCUS_SAVED: '집중 기록이 저장되었습니다.',
};
