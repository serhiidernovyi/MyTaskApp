import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ticketsApi, type Ticket, type TicketListResponse, type CreateTicketRequest, type UpdateTicketRequest } from '@/api/tickets'

export const useTicketsStore = defineStore('tickets', () => {
  // State
  const tickets = ref<Ticket[]>([])
  const currentTicket = ref<Ticket | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    total: 0,
    per_page: 15, // Возвращаем к нормальному значению
    current_page: 1,
    last_page: 1,
    from: null as number | null,
    to: null as number | null
  })
  const filters = ref({
    status: '',
    category: '',
    search: '',
    sort_created_at: 'DESC' as 'ASC' | 'DESC',
    created_at: ''
  })

  // Getters
  const totalTickets = computed(() => {
    const total = pagination.value.total
    return Array.isArray(total) ? total[0] : total
  })
  const currentPage = computed(() => {
    const page = pagination.value.current_page
    return Array.isArray(page) ? page[0] : page
  })
  const lastPage = computed(() => {
    const page = pagination.value.last_page
    return Array.isArray(page) ? page[0] : page
  })
  const hasNextPage = computed(() => currentPage.value < lastPage.value)
  const hasPrevPage = computed(() => currentPage.value > 1)

  // Actions
  async function fetchTickets(page = 1) {
    loading.value = true
    error.value = null
    
    try {
      const response = await ticketsApi.getTickets({
        page,
        per_page: pagination.value.per_page || 15,
        ...filters.value
      })
      
      tickets.value = response.data
      pagination.value = response.meta
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка загрузки тикетов'
      console.error('Error fetching tickets:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchTicket(id: string) {
    loading.value = true
    error.value = null
    
    try {
      currentTicket.value = await ticketsApi.getTicket(id)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка загрузки тикета'
      console.error('Error fetching ticket:', err)
    } finally {
      loading.value = false
    }
  }

  async function createTicket(data: CreateTicketRequest) {
    loading.value = true
    error.value = null
    
    try {
      const newTicket = await ticketsApi.createTicket(data)
      tickets.value.unshift(newTicket)
      return newTicket
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка создания тикета'
      console.error('Error creating ticket:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateTicket(id: string, data: UpdateTicketRequest) {
    loading.value = true
    error.value = null
    
    try {
      const updatedTicket = await ticketsApi.updateTicket(id, data)
      
      // Обновляем тикет в списке
      const index = tickets.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tickets.value[index] = updatedTicket
      }
      
      // Обновляем текущий тикет если это он
      if (currentTicket.value?.id === id) {
        currentTicket.value = updatedTicket
      }
      
      return updatedTicket
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка обновления тикета'
      console.error('Error updating ticket:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function classifyTicket(id: string) {
    loading.value = true
    error.value = null
    
    try {
      await ticketsApi.classifyTicket(id)
      // Перезагружаем тикет после классификации
      await fetchTicket(id)
      // Обновляем тикет в списке
      const index = tickets.value.findIndex(t => t.id === id)
      if (index !== -1) {
        await fetchTickets(pagination.value.current_page)
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка классификации тикета'
      console.error('Error classifying ticket:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function setFilters(newFilters: Partial<typeof filters.value>) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function clearFilters() {
    filters.value = {
      status: '',
      category: '',
      search: '',
      sort_created_at: 'DESC',
      created_at: ''
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    tickets,
    currentTicket,
    loading,
    error,
    pagination,
    filters,
    
    // Getters
    totalTickets,
    currentPage,
    lastPage,
    hasNextPage,
    hasPrevPage,
    
    // Actions
    fetchTickets,
    fetchTicket,
    createTicket,
    updateTicket,
    classifyTicket,
    setFilters,
    clearFilters,
    clearError
  }
})
