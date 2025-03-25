import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://16.171.79.44',
  headers: {
    'Content-Type': 'application/json',
  },
});

const fetchProtectedData = async (userIdToImpersonate) => {
  try {
    const response = await apiClient.get('/api/some-protected-view/', {
      headers: {
        'Impersonate-User': userIdToImpersonate, // Pass the user ID here
      },
    });
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error fetching data:', error.response || error);
  }
};