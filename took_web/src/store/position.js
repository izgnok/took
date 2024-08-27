import create from 'zustand';

export const usePosition = create((set) => ({
  latitude: 35.09362371920619,
  longitude: 128.85603563150357,
  setPosition: ({ latitude, longitude }) => {
    set(() => ({ latitude: latitude, longitude: longitude }));
  },
}));
