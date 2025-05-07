import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        const accessToken = user?.access

        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            error.response?.date?.code === 'token_not_valid' &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const user = JSON.parse(localStorage.getItem('user') || '{}')
                const refresh = user?.refresh;

                const res = await axios.post(`http://localhost:8000/api/token/refresh/`, {refresh: refresh,})

                const newAccess = res.data.access

                user.access = newAccess
                localStorage.setItem('user', JSON.stringify(user))

                originalRequest.headers['Authorization'] = `Bearer ${newAccess}`
                return api(originalRequest)
            } catch (refreshError) {
                console.error('Token refresh failed', refreshError)
                localStorage.removeItem('user')
                window.location.href = '/login'
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

export default api;
