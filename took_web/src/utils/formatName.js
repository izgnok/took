export const maskName = (name) => {
  if (name.length <= 2) return name;
  const firstChar = name[0];
  const lastChar = name[name.length - 1];
  const middleChars = name.slice(1, -1).replace(/./g, '*');
  return `${firstChar}${middleChars}${lastChar}`;
};
export default maskName;
