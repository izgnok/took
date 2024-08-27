import create from 'zustand';

export const useUser = create((set) => ({
  id: '',
  seq: null,
  gender: '',
  addr: '',
  lat: null,
  lon: null,
  img_no: null,
  name: '',
  email: '',
  birth: '',
  phone: '',
  isLoggedIn: false,
  setUser: (user) => {
    set((state) => ({
      ...state,
      id: user.userId,
      seq: user.userSeq,
      gender: user.gender,
      addr: user.addr,
      lat: user.lat,
      lon: user.lon,
      img_no: user.imageNo,
      name: user.userName,
      email: user.email,
      birth: user.birth,
      phone: user.phoneNumber,
      isLoggedIn: true,
    }));
  },
  setName: (name) => {
    set((state) => ({
      ...state,
      name: name,
    }));
  },
  setUserSeq: (seq) => {
    set((state) => ({
      ...state,
      seq: seq,
    }));
  },
  setEmail: (email) => {
    set((state) => ({
      ...state,
      email: email,
    }));
  },
  setPhone: (phone) => {
    set((state) => ({
      ...state,
      phone: phone,
    }));
  },
  setLoggedIn: () =>
    set((state) => ({
      ...state,
      isLoggedIn: true,
    })),
  setLoggedOut: () =>
    set((state) => ({
      ...state,
      isLoggedIn: false,
    })),
}));
