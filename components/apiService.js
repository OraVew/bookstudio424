import axios from 'axios';

export const fetchAvailableTimes = async (date) => {
  const formattedDate = new Date(date).toISOString();
  const requestUrl = `/api/calendar?date=${formattedDate}`;
  const response = await axios.get(requestUrl);
  return response.data;
};
