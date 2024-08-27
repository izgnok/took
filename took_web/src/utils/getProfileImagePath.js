const getProfileImagePath = (imgNo) => {
  const profileImages = import.meta.glob('../assets/profile/*.png', {
    eager: true,
  });
  return profileImages[`../assets/profile/img${imgNo}.png`]?.default || '';
};

export default getProfileImagePath;
