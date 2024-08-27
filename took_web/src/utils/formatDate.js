export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear().toString().slice(-2);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${month}.${day} (${dayOfWeek}) ${hours}:${minutes}`;
};

export const formatDateWithoutTime = (dateString) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
  return `${month}.${day} (${dayOfWeek})`;
};

export const formatDateWithYear = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${year}.${month}.${day} (${weekday}) ${formattedHours}:${formattedMinutes}`;
};

export const formatDateOnly = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  };
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', options);
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? '오후' : '오전';
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${ampm} ${formattedHours}:${formattedMinutes}`;
};

export function formatBeforeTime(timeString) {
  const date = new Date(timeString);
  const now = new Date();
  const diff = (now - date) / 1000 / 60; // difference in minutes

  if (diff < 1) {
    return '방금 전';
  } else if (diff < 60) {
    return `${Math.floor(diff)}분 전`;
  } else if (diff < 24 * 60) {
    return `${Math.floor(diff / 60)}시간 전`;
  } else if (diff < 7 * 24 * 60) {
    return `${Math.floor(diff / (24 * 60))}일 전`;
  } else if (diff < 30 * 24 * 60) {
    return `${Math.floor(diff / (7 * 24 * 60))}주 전`;
  } else if (diff < 12 * 30 * 24 * 60) {
    return `${Math.floor(diff / (30 * 24 * 60))}개월 전`;
  } else {
    return `${Math.floor(diff / (12 * 30 * 24 * 60))}년 전`;
  }
}

export function formatFinishTime(timeString) {
  const date = new Date(timeString);
  const now = new Date();
  const diff = (now - date) / 1000 / 60; // difference in minutes

  if (diff < 1) {
    return '방금 전';
  } else if (diff < 60) {
    return `${Math.floor(diff)}분 전`;
  } else if (diff < 24 * 60) {
    const hours = Math.floor(diff / 60);
    const minutes = Math.floor(diff % 60);
    return `${hours}시간 ${minutes}분 전`;
  } else if (diff < 7 * 24 * 60) {
    return `${Math.floor(diff / (24 * 60))}일 전`;
  } else if (diff < 30 * 24 * 60) {
    return `${Math.floor(diff / (7 * 24 * 60))}주 전`;
  } else if (diff < 12 * 30 * 24 * 60) {
    return `${Math.floor(diff / (30 * 24 * 60))}개월 전`;
  } else {
    return `${Math.floor(diff / (12 * 30 * 24 * 60))}년 전`;
  }
}
