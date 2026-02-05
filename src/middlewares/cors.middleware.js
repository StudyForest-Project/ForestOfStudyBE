export const cors = (req, res, next) => {
  // 요청을 보낸 “출처(도메인+포트)” 값 (브라우저가 cross-origin 요청일 때 주로 보냄)
  const origin = req.headers.origin;
  // 현재 서버가 운영 환경인지 판단 (배포 환경에서 보통 'production')
  const isProduction = process.env.NODE_ENV === 'production';

  // 운영/개발 환경에 따라 허용할 출처(Origin) 목록을 다르게 설정
  const whiteList = isProduction
    ? ['https://voluble-capybara-0d6edd.netlify.app'] // netlify 올린주소로변경
    : ['http://localhost:3000', 'http://localhost:5173'];

  // origin이 존재하고(=브라우저에서 온 cross-origin 가능성이 큼),
  // 그 origin이 화이트리스트에 포함돼 있으면 허용
  // origin이 없으면(undefined) 여기서 isAllowed는 undefined가 되어 false처럼 동작
  // undefined 일떄 boolean으로 고정 하기위해 설정
  const isAllowed = !!origin && whiteList.includes(origin);

  if (isAllowed) {
    // 특정 origin만 허용 (쿠키/세션을 쓰려면 '*'가 아니라 정확한 origin이 필요)
    res.header('Access-Control-Allow-Origin', origin);

    // 쿠키/세션 등 “자격 증명(credential)”을 허용하겠다는 의미
    // 나중에 쿠키 기반 로그인 붙일 때 필요 (프론트도 credentials: 'include'가 필요)
    res.header('Access-Control-Allow-Credentials', 'true');

    // 캐시가 Origin별로 다른 응답으로 취급하도록 지시 (CORS 헤더가 origin에 따라 달라지므로)
    res.header('Vary', 'Origin');
  }

  // 브라우저가 허용할 HTTP 메서드 목록(특히 preflight OPTIONS 응답에 중요)
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  );

  // 브라우저가 요청에 실어 보낼 수 있도록 허용하는 헤더 목록
  // (Authorization 같은 커스텀 헤더를 쓰면 preflight에서 이 값이 중요)
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 브라우저가 보내는 사전 요청(Preflight) 처리
  // 여기서 204로 바로 끝내면 브라우저가 “이 요청은 허용됨”으로 판단하고 실제 요청을 보냄
  if (req.method === 'OPTIONS') return res.sendStatus(204);

  console.log('origin:', origin);

  next();
};
