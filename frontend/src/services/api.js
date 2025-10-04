import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // Your backend API base URL
  withCredentials: true, // This is CRITICAL for sending cookies
});

export default apiClient;