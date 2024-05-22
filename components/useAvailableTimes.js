import { useState, useEffect, useRef } from 'react';
import { fetchAvailableTimes } from './apiService';

const convertTo24HourFormat = (time) => {
  if (!time) return null;
  const [timePart, period] = time.split(' ');
  let [hour] = timePart.split(':').map(Number);
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  return hour;
};

export const useAvailableTimes = (watchedDate) => {
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [startTimes, setStartTimes] = useState([]);
  const [endTimes, setEndTimes] = useState([]);
  const cacheRef = useRef({});

  useEffect(() => {
    if (watchedDate) {
      const cachedData = cacheRef.current[watchedDate.toISOString()];
      if (cachedData) {
        setStartTimes(cachedData.startTimes);
        setEndTimes(cachedData.endTimes);
      } else {
        setLoadingTimes(true); // Set loading state to true
        fetchAvailableTimes(watchedDate)
          .then(busySlots => {
            const startTimes = generateStartTimes(busySlots);
            const endTimes = generateEndTimes(busySlots);
            setStartTimes(startTimes);
            setEndTimes(endTimes);
            cacheRef.current[watchedDate.toISOString()] = { startTimes, endTimes };
          })
          .catch(error => {
            console.error("Failed to fetch available times", error);
            setStartTimes([]);
            setEndTimes([]);
          })
          .finally(() => setLoadingTimes(false)); // Set loading state to false
      }
    }
  }, [watchedDate]);

  const generateStartTimes = (busySlots) => {
    return generateTimeSlots(busySlots, 9, 23);
  };

  const generateEndTimes = (busySlots) => {
    const extendedBusySlots = [...busySlots];
    const nextDay = new Date(busySlots[0].start);
    nextDay.setDate(nextDay.getDate() + 1);
    extendedBusySlots.push({ start: nextDay.toISOString(), end: nextDay.toISOString() });
    return generateTimeSlots(extendedBusySlots, 9, 26);
  };

  const generateTimeSlots = (busySlots, startHour, endHour) => {
    const times = [];
    for (let i = startHour; i < endHour; i++) {
      const hour = i < 24 ? i : i - 24;
      const formattedHour = formatTime(hour);
      const isAvailable = checkAvailability(formattedHour, busySlots);
      times.push({ time: formattedHour, isAvailable: !isAvailable });
    }
    return times;
  };

  const formatTime = (hour) => {
    const displayHour = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    return `${displayHour}:00 ${suffix}`;
  };

  const checkAvailability = (formattedHour, busySlots) => {
    return busySlots.every(slot => {
      const start = new Date(slot.start);
      const end = new Date(slot.end);
      const slotHour = convertTo24HourFormat(formattedHour);
      const slotDate = new Date(start.getFullYear(), start.getMonth(), start.getDate(), slotHour, 0, 0);
      if (slotHour < start.getHours()) {
        slotDate.setDate(slotDate.getDate() + 1);
      }
      return slotDate < start || slotDate >= end;
    });
  };

  return { loadingTimes, startTimes, endTimes, convertTo24HourFormat };
};
