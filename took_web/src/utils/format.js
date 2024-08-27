/**
 * 숫자를 3자리마다 콤마(,)를 추가한 문자열로 포맷팅합니다.
 * @param {number|string} number - 포맷팅할 숫자
 * @returns {string} 포맷팅된 숫자 문자열
 */
export function formatNumber(number) {
  if (number == null) return '0';
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 계좌 번호를 뒤 4자리만 보이도록 포맷팅합니다.
 * 나머지 숫자는 '*'로 마스킹됩니다.
 * @param {string} accountNum - 포맷팅할 계좌 번호
 * @returns {string} 포맷팅된 계좌 번호
 */
export const formatAccountNumber = (accountNum) => {
  if (!accountNum) return '';

  const visibleDigits = accountNum.slice(-4);
  const maskedDigits = '*'.repeat(accountNum.length - 4);
  return maskedDigits + visibleDigits;
};

/**
 * 전화번호를 한국 전화번호 형식으로 포맷팅합니다.
 * 입력된 숫자를 기준으로 하이픈(-)을 추가합니다.
 * @param {string} value - 포맷팅할 전화번호
 * @returns {string} 포맷팅된 전화번호
 */
export const formatPhoneNumber = (value) => {
  if (!value) return value;

  const phoneNumber = value.replace(/[^\d]/g, '');
  const phoneNumberLength = phoneNumber.length;

  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
  }
  return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
};

/**
 * 문자열에서 모든 하이픈(-)을 제거합니다.
 * @param {string} value - 하이픈을 제거할 문자열
 * @returns {string} 하이픈이 제거된 문자열
 */
export const removeHyphens = (value) => {
  if (!value) return value;
  return value.replace(/-/g, '');
};
