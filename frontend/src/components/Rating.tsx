import { FaStar, FaStarHalf, FaRegStar } from 'react-icons/fa';

const Rating = ({ numReviews, rating }) => {
  return (
    <div className="rating">
      <span>
        {Array.from({ length: Math.floor(rating) }).map(() => (
          <FaStar />
        ))}
        {Array.from({ length: Math.ceil(rating % 1) }).map(() => (
          <FaStarHalf />
        ))}
        {Array.from({ length: 5 - Math.ceil(rating) }).map(() => (
          <FaRegStar />
        ))}
      </span>
      <span className="rating-text">{numReviews && numReviews}</span>
    </div>
  );
};

export default Rating;
