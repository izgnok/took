export const handleApiError = (error) => {
  if (error instanceof Error) {
    console.log('에러 발생: ', error);
    return { error: error.message };
  } else {
    console.log('알 수 없는 에러 발생: ', error);
    return { error: '알 수 없는 에러' };
  }
};
