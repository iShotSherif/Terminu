import axios from 'axios';

export const fetchTickers = async () => {
  try {
    const response = await axios.get('https://api.bybit.com/v5/market/instruments-info?category=linear');
    return response.data.result;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
};