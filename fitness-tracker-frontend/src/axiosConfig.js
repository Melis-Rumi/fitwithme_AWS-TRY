import axios from 'axios';

// Create a custom axios instance with flexible configuration
const apiClient = axios.create({
  // Use the IP address or domain of your backend
  baseURL: process.env.REACT_APP_API_URL || 'https://16.171.79.44',
  
  // Timeout setting
  timeout: 10000,

  // Disable SSL verification (ONLY FOR DEVELOPMENT)
  httpsAgent: {
    rejectUnauthorized: false
  },

  // Additional headers if needed
  headers: {
    'Content-Type': 'application/json',
    // Add any other default headers
  }
});

// Add a request interceptor for logging (optional)
apiClient.interceptors.request.use(
  config => {
    console.log('Request Config:', config.url, config.method);
    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('Full Error Response:', error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Error Data:', error.response.data);
      console.error('Error Status:', error.response.status);
      console.error('Error Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error Message:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;