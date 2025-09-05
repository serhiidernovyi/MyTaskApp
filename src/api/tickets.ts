import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

export interface Ticket {
  id: string
  subject: string
  body: string
  status: 'new' | 'open' | 'pending' | 'closed'
  category: string | null
  confidence: number | null
  explanation: string | null
  note: string | null
  category_is_manual: boolean
  category_changed_at: string | null
  created_at: string
  updated_at: string
}

export interface TicketListResponse {
  data: Ticket[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
    from: number | null
    to: number | null
  }
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
}

export interface CreateTicketRequest {
  subject: string
  body: string
  status?: 'new' | 'open' | 'pending' | 'closed'
}

export interface UpdateTicketRequest {
  subject?: string
  body?: string
  status?: 'new' | 'open' | 'pending' | 'closed'
  category?: string
  note?: string
}

export interface StatsResponse {
  categories: Record<string, number>
  statuses: Record<string, number>
  daily_stats: Array<{
    date: string
    created: number
    closed: number
  }>
  overview: {
    total_tickets: number
    unclassified: number
    manual_classifications: number
    ai_classifications: number
    avg_confidence: number
  }
  top_issues: Array<{
    category: string
    count: number
    percentage: number
  }>
}

export const ticketsApi = {
  // Получить список тикетов
  async getTickets(params?: {
    page?: number
    per_page?: number
    status?: string
    category?: string
    search?: string
    sort_created_at?: 'ASC' | 'DESC'
    created_at?: string
  }): Promise<TicketListResponse> {
    // Очищаем параметры от undefined значений
    const cleanParams: Record<string, any> = {}
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Убеждаемся, что числовые параметры передаются как числа
          if (key === 'page' || key === 'per_page') {
            const numValue = Number(value)
            if (!isNaN(numValue) && numValue > 0) {
              cleanParams[key] = numValue
            }
          } else {
            cleanParams[key] = value
          }
        }
      })
    }
    
    // Устанавливаем значения по умолчанию
    if (!cleanParams.page) cleanParams.page = 1
    if (!cleanParams.per_page) cleanParams.per_page = 15
    
    // Создаем URL с параметрами вручную
    const urlParams = new URLSearchParams()
    Object.entries(cleanParams).forEach(([key, value]) => {
      urlParams.append(key, String(value))
    })
    
    const url = `/tickets?${urlParams.toString()}`
    const response = await api.get(url)
    return response.data
  },

  // Получить тикет по ID
  async getTicket(id: string): Promise<Ticket> {
    const response = await api.get(`/tickets/${id}`)
    return response.data
  },

  // Создать тикет
  async createTicket(data: CreateTicketRequest): Promise<Ticket> {
    const response = await api.post('/tickets', data)
    return response.data
  },

  // Обновить тикет
  async updateTicket(id: string, data: UpdateTicketRequest): Promise<Ticket> {
    const response = await api.patch(`/tickets/${id}`, data)
    return response.data
  },

  // Классифицировать тикет
  async classifyTicket(id: string): Promise<{ message: string }> {
    const response = await api.post(`/tickets/${id}/classify`)
    return response.data
  },

  // Получить статистику
  async getStats(): Promise<StatsResponse> {
    const response = await api.get('/stats')
    return response.data
  }
}
