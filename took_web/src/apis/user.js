import { member_request, request } from './request';
import { handleApiError } from './errorHandling';
import Cookies from 'js-cookie';

// signUpApi params
// {
//     "id": “turtle",
//     "password": "P!ssw0rd",
//     "email": "email@email.com",
//     "certificationNumber": "0000"
//     } → 추가 커스텀 필요
// 회원가입
export const signUpApi = async (params) => {
  try {
    const response = await member_request.post('/api/auth/sign-up', params);
    return response.data;
  } catch (err) {
    return handleApiError(err);
  }
};

// validIdApi params
// {
//     "id": “turtle"
//     }
// 아이디 중복 검사
export const validIdApi = async (params) => {
  try {
    const response = await member_request.post('/api/auth/id-check', params);
    return response.data;
  } catch (err) {
    return handleApiError(err);
  }
};

// emailCertificationApi params
// {
//     "id": “turtle",
//     "email": "email@email.com"
//     }
// 이메일 인증
export const emailCertificateApi = async (params) => {
  try {
    const response = await member_request.post(
      '/api/auth/email-certification',
      params
    );
    return response.data;
  } catch (err) {
    return handleApiError(err);
  }
};

// CheckEmailCodeApi
// {
//     "id": “turtle",
//     "email": "email@email.com",
//     "certificationNumber": "0000"
//     }
// 이메일 인증 확인
export const checkEmailCodeApi = async (params) => {
  try {
    const response = await member_request.post(
      '/api/auth/check-certification',
      params
    );
    return response.data;
  } catch (err) {
    return handleApiError(err);
  }
};

// loginApi params
// {
//     "id": “turtle",
//     "password": "P!ssw0rd"
//     }
// 로그인
// 로그인
export const loginApi = async (params, setAccessToken) => {
  try {
    const response = await member_request.post('/api/auth/sign-in', params);
    const accessToken = response.data.accessToken;

    if (accessToken) {
      setAccessToken(accessToken);
      localStorage.setItem('accessToken', accessToken);
    }

    return response.data;
  } catch (err) {
    return handleApiError(err);
  }
};

//getUserInfoApi
// 요청
//  {
//   ”userSeq” : 2
//   }
// 응답
// {
//   "code": "su",
//   "message": "Success.",
//   "userSeq": 17,
//   "userId": "a",
//   "userName": "참",
//   "email": "ckalswn007@naver.com",
//   "phoneNumber": "01077228267",
//   "birth": "20010118",
//   "createdAt": "2024-08-02T07:38:31.861593",
//   "sido": "부산광역시",
//   "gugun": "강서구",
//   "addr": "녹산산업중로 333(송정동)",
//   "lat": 35.096235,
//   "lng": 128.855274,
//   "imageNo": 7,
//   "role": "ROLE_USER",
//   "nickname": null,
//   "gender" : "F" / "M"
//   }
export const getUserInfoApi = async (params) => {
  try {
    const response = await request.post('/api/user/info', params);
    return response.data;
  } catch (err) {
    return handleApiError(err);
  }
};

// refreshAccessTokenApi
// params에 refreshToken 담아서 요청
export const refreshAccessTokenApi = async () => {
  try {
    const refreshToken = Cookies.get('refreshToken');
    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }
    const response = await request.post('/api/auth/refresh-access-token', {
      refreshToken: refreshToken,
    });

    return response.data;
  } catch (err) {
    return handleApiError(err);
  }
};

/* {
  "userId" : "yourId",
  "userName" : "yourName",
  "phoneNumber": "yourPhoneNumber"
  } */
export const modifyUserInfoApi = async (params) => {
  try {
    const response = await request.post('/api/user/info-change', params);
    return response.data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const modifyPwdApi = async (params) => {
  try {
    const response = await request.post('/api/user/change-pwd', params);
    return response.data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const logoutApi = async () => {
  try {
    const response = await request.get('/api/user/sign-out');
    return response.data;
  } catch (err) {
    return handleApiError(err);
  }
};

// 근처에 사는 사람들 List
// 요청
// {
//   ”lon” :  ,
//   ”lat”  :
//   }
export const getUserApi = async () => {
  try {
    const response = await request.post('/api/user/delivery-near-user');
    return response.data;
  } catch (err) {
    return handleApiError(err);
  }
};

export const getUserLocation = async () => {
  try {
  } catch (error) {}
};

export const writeUserLocation = async ({ latitude, longitude }) => {
  try {
  } catch (error) {}
};

export const modifyUserLocation = async (params) => {
  try {
    const response = await request.put('/api/user/setAddress', params);
    return response.data;
  } catch (error) {
    return handleApiError(err);
  }
};
