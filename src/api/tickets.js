import axios from 'axios'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API functions
export const ticketsApi = {
  async getTickets(params = {}) {
    const urlParams = new URLSearchParams()
    
    // Add pagination
    if (params.page) urlParams.append('page', params.page)
    if (params.per_page) urlParams.append('per_page', params.per_page)
    
    // Add filters
    if (params.status) urlParams.append('status', params.status)
    if (params.category) urlParams.append('category', params.category)
    if (params.sort) urlParams.append('sort', params.sort)
    if (params.order) urlParams.append('order', params.order)
    
    const url = `/tickets?${urlParams.toString()}`
    const response = await api.get(url)
    return response.data
  },

  async getTicket(id) {
    const response = await api.get(`/tickets/${id}`)
    return response.data
  },

  async createTicket(data) {
    const response = await api.post('/tickets', data)
    return response.data
  },

  async updateTicket(id, data) {
    const response = await api.patch(`/tickets/${id}`, data)
    return response.data
  },

  async classifyTicket(id) {
    const response = await api.post(`/tickets/${id}/classify`)
    return response.data
  },

  async getStats() {
    const response = await api.get('/stats')
    return response.data
  }
}