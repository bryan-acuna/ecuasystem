import { Text } from '@radix-ui/themes';
import { Star } from 'lucide-react';

interface RatingProps {
  rating: number;
  numReviews?: string;
}

const Rating = ({ numReviews, rating }: RatingProps) => {
  const fullStars  = Math.floor(rating);
  const hasHalf    = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <span style={{ display: 'flex', gap: 2 }}>
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`f${i}`} size={14} style={{ fill: '#f59e0b', stroke: '#f59e0b' }} />
        ))}
        {hasHalf && (
          <Star key="half" size={14} style={{ fill: '#f59e0b', stroke: '#f59e0b', opacity: 0.5 }} />
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`e${i}`} size={14} style={{ fill: 'none', stroke: '#f59e0b' }} />
        ))}
      </span>
      {numReviews && (
        <Text size="1" color="gray">{numReviews}</Text>
      )}
    </div>
  );
};

export default Rating;
