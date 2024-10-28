'use client'

import { useState, useEffect } from 'react';

export const useDateTime = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return {
    date: dateTime.toDateString(),
    time: dateTime.toLocaleTimeString()
  };
};