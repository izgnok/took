const Button = ({
  name,
  color,
  width,
  textColor,
  handleClick,
  image,
  style,
}) => {
  return (
    <button
      className={`w-${width} bg-${color} text-${textColor} py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline flex items-center justify-center ${style}`}
      type="submit"
      onClick={handleClick}
    >
      {image && <img src={image} alt={image} className="w-6 h-6 mr-2" />}
      {name}
    </button>
  );
};

export default Button;
