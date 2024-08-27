import RightArrow from '../../common/RightArrow';
import { Link } from 'react-router-dom';
const InfoCard = ({ label, name, arrow, url }) => {
  return (
    <div className="flex gap-5 justify-between self-center mt-8 w-full text-sm leading-5 whitespace-nowrap max-w-[274px] text-neutral-700">
      <div className="flex flex-col px-5">
        <div className="font-bold">{label}</div>
        <div className="mt-4">{name}</div>
      </div>
      {arrow && (
        <Link to={url}>
          <RightArrow />
        </Link>
      )}
    </div>
  );
};

export default InfoCard;
