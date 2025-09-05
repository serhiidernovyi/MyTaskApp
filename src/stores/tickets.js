import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ticketsApi } from '@/api/tickets.js'

export const useTicketsStore = defineStore('tickets', () => {
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
    search: '',
    sort_created_at: 'DESC',
    created_at: '',
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
      const apiParams = {
        page,
        ...filters.value
      }

      Object.keys(apiParams).forEach(key => {
        if (apiParams[key] === '' || apiParams[key] === null || apiParams[key] === undefined) {
          delete apiParams[key]
        }
      })


      const response = await ticketsApi.getTickets(apiParams)

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
      error.value = 'Error fetching tickets'
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
      error.value = 'Error fetching ticket'
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
      error.value = 'Error creating ticket'
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

      const index = tickets.value.findIndex(ticket => ticket.id === id)
      if (index !== -1) {
        tickets.value[index] = updatedTicket
      }

      if (currentTicket.value && currentTicket.value.id === id) {
        currentTicket.value = updatedTicket
      }

      return updatedTicket
    } catch (err) {
      error.value = 'Error update ticket'
      console.error('Error updating ticket:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function classifyTicket(id) {
    loading.value = true
    error.value = null

    try {
      const response = await ticketsApi.classifyTicket(id)

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
      error.value = err.response?.data?.message || err.message || 'Error classify'
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
