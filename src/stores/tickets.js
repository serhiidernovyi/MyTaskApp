import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ticketsApi } from '@/api/tickets.js'

export const useTicketsStore = defineStore('tickets', () => {
  // State
  const tickets = ref([])
  const currentTicket = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    total: 0,
    per_page: 15,
    current_page: 1,
    last_page: 1,
    from: null,
    to: null
  })
  const filters = ref({
    status: '',
    category: '',
    sort: 'created_at',
    order: 'desc'
  })

  // Getters
  const currentPage = computed(() => pagination.value.current_page)
  const lastPage = computed(() => pagination.value.last_page)
  const totalTickets = computed(() => pagination.value.total)

  // Actions
  async function fetchTickets(page = 1) {
    loading.value = true
    error.value = null
    
    try {
      const response = await ticketsApi.getTickets({
        page,
        ...filters.value
      })
      
      tickets.value = response.data
      pagination.value = {
        total: response.total,
        per_page: response.per_page,
        current_page: response.current_page,
        last_page: response.last_page,
        from: response.from,
        to: response.to
      }
    } catch (err) {
      error.value = 'Ошибка загрузки тикетов'
      console.error('Error fetching tickets:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchTicket(id) {
    loading.value = true
    error.value = null
    
    try {
      const ticket = await ticketsApi.getTicket(id)
      currentTicket.value = ticket
      return ticket
    } catch (err) {
      error.value = 'Ошибка загрузки тикета'
      console.error('Error fetching ticket:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createTicket(ticketData) {
    loading.value = true
    error.value = null
    
    try {
      const newTicket = await ticketsApi.createTicket(ticketData)
      tickets.value.unshift(newTicket)
      return newTicket
    } catch (err) {
      error.value = 'Ошибка создания тикета'
      console.error('Error creating ticket:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateTicket(id, ticketData) {
    loading.value = true
    error.value = null
    
    try {
      const updatedTicket = await ticketsApi.updateTicket(id, ticketData)
      
      // Update in tickets list
      const index = tickets.value.findIndex(ticket => ticket.id === id)
      if (index !== -1) {
        tickets.value[index] = updatedTicket
      }
      
      // Update current ticket if it's the same
      if (currentTicket.value && currentTicket.value.id === id) {
        currentTicket.value = updatedTicket
      }
      
      return updatedTicket
    } catch (err) {
      error.value = 'Ошибка обновления тикета'
      console.error('Error updating ticket:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function classifyTicket(id) {
    console.log('Store: Starting classification for ticket:', id)
    loading.value = true
    error.value = null
    
    try {
      const response = await ticketsApi.classifyTicket(id)
      console.log('Store: Classification API response:', response)
      
      // Refresh the ticket data after classification
      await fetchTicket(id)
      
      return response
    } catch (err) {
      console.error('Store: Classification error:', {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data
      })
      error.value = err.response?.data?.message || err.message || 'Ошибка классификации тикета'
      throw err
    } finally {
      loading.value = false
    }
  }

  function setFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
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
    currentPage,
    lastPage,
    totalTickets,
    
    // Actions
    fetchTickets,
    fetchTicket,
    createTicket,
    updateTicket,
    classifyTicket,
    setFilters,
    clearError
  }
})