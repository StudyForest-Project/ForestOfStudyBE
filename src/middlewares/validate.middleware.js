import { flattenError } from 'zod/v4/core';
import { HTTP_STATUS } from '#constants';

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const { fieldErrors, formErrors } = flattenError(result.error);
    console.log(fieldErrors, '에러구조');

    // 배열에서 첫 번째 메시지만 추출
    const fields = Object.fromEntries(
      Object.entries(fieldErrors).map(([key, messages]) => [key, messages[0]]),
    );
    console.log(fields, '===============');
    // refine 에러는 formErrors에 들어감 (전체 객체 검증)
    if (formErrors.length > 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: {
          status: HTTP_STATUS.BAD_REQUEST,
          code: 'VALIDATION_ERROR',
          message: formErrors[0],
        },
      });
    }

    // -> 객체 데이터 배열로 변환
    // console.log(Object.entries(fieldErrors));
    // -> 배열로 변환 데이터 중 첫번째 에러  메세지만 추출
    // console.log(
    //   Object.entries(fieldErrors).map(([key, messages]) => [key, messages[0]]),
    // );
    // -> fromEntries 배열 객체로변환
    // console.log(
    //   Object.fromEntries(
    //     Object.entries(fieldErrors).map(([key, messages]) => [
    //       key,
    //       messages[0],
    //     ]),
    //   ),
    // );
    console.log('>>>>>>>>>>>>', Object.values(fields), '=========');
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: {
        status: HTTP_STATUS.BAD_REQUEST,
        code: 'VALIDATION_ERROR',
        message: Object.values(fields)[0],
      },
    });
  }

  req.body = result.data;
  next();
};
