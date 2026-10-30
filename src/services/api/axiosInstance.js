import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  timeout: 15000,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const responseMessage = error.response?.data?.message;
    const message = responseMessage || (
      error.code === 'ECONNABORTED'
        ? 'The request timed out. Please try again.'
        : error.response
          ? 'Something went wrong while processing your request.'
          : 'Unable to connect. Check your internet connection and try again.'
    );
    return Promise.reject(Object.assign(error, { userMessage: message }));
  }
);

export default axiosInstance;
