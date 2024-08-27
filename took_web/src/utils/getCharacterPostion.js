export const getUserStyle = (index, total, size) => {
  const angle = (index / total) * 2 * Math.PI;

  const baseRadius = 100;
  const maxRadius = 140;

  const imageSize = size;
  const radius = Math.min(maxRadius, baseRadius + (total - 5) * 1.6);

  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  return {
    transform: `translate(${centerX + x - imageSize / 2}px, ${centerY / 2 + y - imageSize / 2}px)`,
  };
};

export const getMyStyle = (size) => {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  return {
    transform: `translate(${centerX - size / 2}px, ${centerY / 2 - size / 2}px)`,
  };
};
