window.kakao = window.kakao || {};

const places = new window.kakao.maps.services.Places();
const geocoder = new window.kakao.maps.services.Geocoder();

export const keywordSearch = (input) => {
  return new Promise((resolve, reject) => {
    const callback = (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        resolve(result);
      } else {
        reject(status);
      }
    };
    places.keywordSearch(input, callback);
  });
};

export const getAddr = (lat, lng) => {
  const coord = new window.kakao.maps.LatLng(lat, lng);

  return new Promise((resolve, reject) => {
    const callback = (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const arr = { ...result };
        if (arr[0].road_address !== null) {
          const _arr = arr[0].road_address.address_name;
          resolve(_arr);
        } else {
          const _arr = arr[0].address.address_name;
          resolve(_arr);
        }
      } else {
        reject(status);
      }
    };
    geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
  });
};

/**
 * 검색어를 받아서 검색 결과 배열을 반환하는 함수
 * @param {string} input - 검색어
 * @returns {Promise<Array>} 검색 결과 배열
 */
export const searchPlaces = async (input) => {
  try {
    const searchResults = await keywordSearch(input);
    console.log(searchResults);
    return searchResults.map((place) => ({
      address_name: place.address_name,
      category_group_code: place.category_group_code,
      category_group_name: place.category_group_name,
      category_name: place.category_name,
      distance: place.distance,
      id: place.id,
      phone: place.phone,
      place_name: place.place_name,
      place_url: place.place_url,
      road_address_name: place.road_address_name,
      x: place.x,
      y: place.y,
    }));
  } catch (error) {
    console.error('검색 실패:', error);
    throw error;
  }
};
