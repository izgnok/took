import axios from 'axios';
import { useToken } from '../store/token';
const SERVER_URL = import.meta.env.VITE_SERVER_URL;
import { refreshAccessTokenApi } from './user';
import Cookies from 'js-cookie';

// request에는 jwt 토큰이 담겨서 전송됨. 회원가입/로그인을 제외한 API 요청에 사용
export const request = axios.create({
  baseURL: `${SERVER_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

request.interceptors.request.use(async (config) => {
  let { accessToken, setAccessToken } = useToken.getState();

  if (!accessToken) {
    const storedAccessToken = localStorage.getItem('accessToken');
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
      config.headers['Authorization'] = 'Bearer ' + storedAccessToken;
    } else {
      const refreshToken = Cookies.get('refreshToken');
      if (refreshToken) {
        try {
          const response = await refreshAccessTokenApi();
          accessToken = response.accessToken;
          setAccessToken(accessToken);
          localStorage.setItem('accessToken', accessToken);
          config.headers['Authorization'] = 'Bearer ' + accessToken;
        } catch (err) {
          console.error('Failed to refresh access token', err);
        }
      } else {
        console.error('No refresh token available');
      }
    }
  } else {
    config.headers['Authorization'] = 'Bearer ' + accessToken;
  }

  return config;
});

// member_request
export const member_request = axios.create({
  baseURL: `${SERVER_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
