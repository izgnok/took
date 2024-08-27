// utils/positionUtils.js

/**
 * 주어진 인덱스와 총 개수에 따라 요소의 위치를 계산합니다.
 * @param {number} index - 요소의 인덱스
 * @param {number} total - 전체 요소의 수
 * @param {number} size - 요소의 크기
 * @returns {object} 요소의 위치를 결정하는 transform 스타일 객체
 */
export const calculateElementPosition = (index, total, size) => {
  const angle = (index / total) * 2 * Math.PI;

  const baseRadius = 100;
  const maxRadius = 140;

  const elementSize = size;
  const radius = Math.min(maxRadius, baseRadius + (total - 5) * 1.6);

  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  return {
    transform: `translate(${centerX + x - elementSize / 2}px, ${centerY / 2 + y - elementSize / 2}px)`,
  };
};

/**
 * 나의 위치를 중앙에 맞추어 계산합니다.
 * @param {number} size - 요소의 크기
 * @returns {object} 요소의 위치를 결정하는 transform 스타일 객체
 */
export const calculateCenterPosition = (size) => {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  return {
    transform: `translate(${centerX - size / 2}px, ${centerY / 2 - size / 2}px)`,
  };
};
