import React, { useEffect, useState } from "react";

const useDynamicRating = (review) => {
  const [averageRating, setAverageRating] = useState(0);
  useEffect(() => {
    if (review?.length) {
      const totalRating = review?.reduce(
        (sum, reviewObj) => sum + reviewObj?.rating,
        0
      );
      setAverageRating(parseFloat((totalRating / review?.length).toFixed(2)));
    } else {
      setAverageRating(0);
    }
  }, [review]);

  return { averageRating };
};

export default useDynamicRating;
