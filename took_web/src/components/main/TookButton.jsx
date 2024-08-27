import taxi from '../../assets/main/taxi.png';
import pay from '../../assets/main/pay.png';
import delivery from '../../assets/main/delivery.png';
import shop from '../../assets/main/shop.png';

export const TookButton = ({ title, content, img }) => {
  return (
    <div className="bg-white relative rounded-2xl shadow p-4 m-1 flex flex-col justify-between h-32 ">
      <div className="flex flex-col">
        <div className="font-extrabold text-lg">{title}</div>
        <div
          className="text-[9px] text-gray-600"
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      </div>
      <div className="absolute right-2 bottom-2 mt-4">
        <img src={img} alt={title} className="w-15 h-15" />
      </div>
    </div>
  );
};
