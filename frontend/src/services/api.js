import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth APIs
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
}

// User APIs
export const userAPI = {
  createAccount: () => api.post('/user/account'),
  getAccount: () => api.get('/user/account'),
  deposit: (depositData) => api.post('/user/deposit', depositData),
  transfer: (transferData) => api.post('/user/transfer', transferData),
  getTransactions: () => api.get('/user/transactions'),
}

// Admin APIs
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  getAllTransactions: () => api.get('/admin/transactions'),
  getFraudTransactions: () => api.get('/admin/transactions/fraud'),
  makeFraudDecision: (transactionId, decision) =>
    api.post(`/admin/transactions/${transactionId}/fraud-decision`, { decision }),
}

export default api

