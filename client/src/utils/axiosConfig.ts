import axios from 'axios'
import { Cookies } from 'react-cookie'

const cookies = new Cookies()

const axiosConfig = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL as string,
  withCredentials: true
})

axiosConfig.interceptors.request.use(
  (config) => {
    const token = cookies.get('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    const csrfToken = cookies.get('csrfToken')
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosConfig.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosConfig
