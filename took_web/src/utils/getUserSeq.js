import { useUser } from '../store/user';

export const getUserSeq = () => {
  const { seq } = useUser();
  return seq;
};
