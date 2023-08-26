import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ endDate, className, onCountdownFinished }) => {
  const calculateTimeLeft = () => {
    const currentTime = new Date();
    const endTime = new Date(endDate);
    const timeDifference = endTime - currentTime;

    if (timeDifference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        finished: true,
      };
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
      finished: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const updatedTimeLeft = calculateTimeLeft();
      setTimeLeft(updatedTimeLeft);

      if (updatedTimeLeft.finished) {
        clearInterval(timer);
        if (onCountdownFinished) {
          onCountdownFinished();
        }
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [onCountdownFinished]);

  return (
    <div className={className}>
      {timeLeft.finished ? (
        <div className='mt-2 text-red-900 font-semibold bg-red-100 border-red-200 border px-4 py-1 rounded-md w-fit'>Expired</div>
      ) : (
        <>
          {timeLeft.days} days {timeLeft.hours} hours {timeLeft.minutes} minutes {timeLeft.seconds} seconds
        </>
      )}
    </div>
  );
};

export default CountdownTimer;
