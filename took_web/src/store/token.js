import { create } from 'zustand';

export const useToken = create((set) => ({
  accessToken: '',
  refreshToken: '',
  setAccessToken: (token) => set(() => ({ accessToken: token })),
  setRefreshToken: (token) => set(() => ({ refreshToken: token })),
}));
