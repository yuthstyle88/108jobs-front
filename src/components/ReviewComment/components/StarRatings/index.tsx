import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  onRatingChange, 
  readonly = false, 
  size = 20 
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (starIndex: number) => {
    if (readonly) return;
    setHoverRating(starIndex);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverRating(0);
  };

  const handleClick = (starIndex: number) => {
    if (readonly || !onRatingChange) return;
    onRatingChange(starIndex);
  };

  const displayRating = hoverRating || rating;

  const renderStar = (starIndex: number) => {
    const isFilled = starIndex <= displayRating;

    return (
      <div
        key={starIndex}
        className="relative inline-block cursor-pointer"
        onMouseEnter={() => handleMouseEnter(starIndex)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick(starIndex)}
      >
        <Star
          size={size}
          className={`absolute ${isFilled ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
        />
        <Star
          size={size}
          className="fill-transparent text-transparent"
        />
      </div>
    );
  };

  return (
    <div className="flex items-center space-x-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((starIndex) => renderStar(starIndex))}
      </div>
      <span className="text-sm text-muted-foreground ml-2">
        {displayRating.toFixed(1)} / 5.0
      </span>
    </div>
  );
};

export default StarRating;
