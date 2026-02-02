import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Attempt to refresh the session
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`, {}, { withCredentials: true });
        return api(originalRequest); // Retry the original request
      } catch (refreshError) {
        // Refresh failed (session expired), boot user to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors (500, 403, 400)
    const message = error.response?.data?.message || "Something went wrong";
    return Promise.reject(message); 
  }
);

export default api;