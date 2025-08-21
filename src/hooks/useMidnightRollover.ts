import { useState, useEffect } from 'react';

export const useMidnightRollover = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const updateDate = () => {
      setCurrentDate(new Date());
    };

    // Calculate milliseconds until next midnight
    const getMillisecondsUntilMidnight = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0); // Next midnight
      return midnight.getTime() - now.getTime();
    };

    // Set initial timeout to next midnight
    const timeoutId = setTimeout(() => {
      updateDate();
      
      // After first midnight, set up daily interval
      const intervalId = setInterval(updateDate, 24 * 60 * 60 * 1000);
      
      return () => clearInterval(intervalId);
    }, getMillisecondsUntilMidnight());

    return () => clearTimeout(timeoutId);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return {
    currentDate,
    formattedDate: formatDate(currentDate)
  };
};
