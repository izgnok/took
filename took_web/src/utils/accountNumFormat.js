export const formatAccountNumber = (accountNum) => {
  const visibleDigits = accountNum.slice(-4);
  const maskedDigits = '*'.repeat(accountNum.length - 4);
  return maskedDigits + visibleDigits;
};
