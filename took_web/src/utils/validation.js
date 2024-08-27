// utils/validation.js

/**
 * 주어진 문자열이 유효한 이메일 주소인지 검증합니다.
 * @param {string} email - 검증할 이메일 주소
 * @returns {boolean} 이메일 주소가 유효한 경우 true, 그렇지 않은 경우 false
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 주어진 문자열이 유효한 비밀번호인지 검증합니다.
 * 비밀번호는 8~13자의 길이를 가지며, 최소 하나의 알파벳과 하나의 숫자를 포함해야 합니다.
 * @param {string} password - 검증할 비밀번호
 * @returns {boolean} 비밀번호가 유효한 경우 true, 그렇지 않은 경우 false
 */
export const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,13}$/;
  return passwordRegex.test(password);
};
