import axios from 'axios';

// Create an axios instance
const api = axios.create({
    withCredentials: true, // send cookies with requests
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Optionally add auth token from localStorage or context
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle global errors (e.g., auth, network)
        if (error.response) {
            if (error.response.status === 401 || error.response.status === 403) {
                // Optionally clear auth and redirect to login
                localStorage.clear();
                window.location.href = '/#/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;