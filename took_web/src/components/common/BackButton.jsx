import backIcon from '../../assets/common/back.svg';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ path }) => {
  const navigate = useNavigate();
  const handleBackClick = () => {
    if (path) {
      navigate(path); // 전달받은 path로 이동
    } else {
      navigate(-1); // path가 없을 경우 -1로 이동
    }
  };
  return (
    <img
      src={backIcon}
      alt="뒤로"
      className="w-6 h-6 mx-6 mt-6 absolute top-0 left-0 opacity-80"
      onClick={handleBackClick}
    />
  );
};

export default BackButton;
