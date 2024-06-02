import axios from 'axios'
import { Cookies } from 'react-cookie'

const cookies = new Cookies()

const axiosConfig = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL as string,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

axiosConfig.interceptors.request.use(
  (config) => {
    const csrftoken = cookies.get('csrftoken')
    if (csrftoken) {
      config.headers['X-CSRFToken'] = csrftoken
    }
    const token = cookies.get('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
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
      cookies.remove('access_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosConfig
