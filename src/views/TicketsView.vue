<template>
  <div class="tickets-view">
    <div class="tickets-view__header">
      <h1 class="tickets-view__title">Tickets</h1>
      <button 
        @click="showCreateModal = true"
        class="tickets-view__create-button"
        data-testid="create-ticket-button"
      >
        <PlusIcon class="tickets-view__create-icon" />
        Create Ticket
      </button>
    </div>

    <TicketFilters 
      :filters="ticketsStore.filters"
      @update:filters="handleFiltersUpdate"
    />

    <div v-if="ticketsStore.loading && ticketsStore.tickets.length === 0" class="tickets-view__loading">
      <div class="tickets-view__spinner"></div>
      <p>Loading tickets...</p>
    </div>

    <div v-else-if="ticketsStore.error" class="tickets-view__error">
      <ExclamationTriangleIcon class="tickets-view__error-icon" />
      <p>{{ ticketsStore.error }}</p>
      <button @click="fetchTickets()" class="tickets-view__retry-button">
        Try Again
      </button>
    </div>

    <div v-else-if="ticketsStore.tickets.length === 0" class="tickets-view__empty">
      <TicketIcon class="tickets-view__empty-icon" />
      <h3>No tickets found</h3>
      <p>Create your first ticket to get started</p>
      <button 
        @click="showCreateModal = true"
        class="tickets-view__create-button"
      >
        Create Ticket
      </button>
    </div>

    <div v-else class="tickets-view__content">
      <div class="tickets-view__grid">
        <TicketCard
          v-for="ticket in ticketsStore.tickets"
          :key="ticket.id"
          :ticket="ticket"
          :loading="classifyingTicketId === ticket.id"
          @view="handleViewTicket"
          @classify="handleClassifyTicket"
        />
      </div>

      <div v-if="ticketsStore.totalTickets > 0" class="tickets-view__pagination">
        <div class="tickets-view__pagination-info">
          Showing {{ ticketsStore.pagination.from || 0 }} to {{ ticketsStore.pagination.to || 0 }} of {{ ticketsStore.totalTickets }} tickets
        </div>
        
        <div class="tickets-view__pagination-controls">
          <button 
            @click="goToPage(ticketsStore.currentPage - 1)"
            :disabled="!ticketsStore.hasPrevPage"
            class="tickets-view__pagination-button"
          >
            Previous
          </button>
          
          <span class="tickets-view__pagination-page">
            Page {{ ticketsStore.currentPage }} of {{ ticketsStore.lastPage }}
          </span>
          
          <button 
            @click="goToPage(ticketsStore.currentPage + 1)"
            :disabled="!ticketsStore.hasNextPage"
            class="tickets-view__pagination-button"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Create Ticket Modal -->
    <CreateTicketModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="handleTicketCreated"
    />
  </div>
</template>

<script>
import { useTicketsStore } from '@/stores/tickets.js'
import { PlusIcon, ExclamationTriangleIcon, TicketIcon } from '@heroicons/vue/24/outline'
import TicketCard from '@/components/Ticket/TicketCard.vue'
import TicketFilters from '@/components/Ticket/TicketFilters.vue'
import CreateTicketModal from '@/components/Ticket/CreateTicketModal.vue'

export default {
  name: 'TicketsView',
  components: {
    PlusIcon,
    ExclamationTriangleIcon,
    TicketIcon,
    TicketCard,
    TicketFilters,
    CreateTicketModal
  },
  data() {
    return {
      showCreateModal: false,
      classifyingTicketId: null
    }
  },
  computed: {
    // Store доступен через setup()
  },
  mounted() {
    this.fetchTickets()
  },
  watch: {
    'ticketsStore.filters'() {
      this.clearError()
    }
  },
  methods: {
    handleFiltersUpdate(newFilters) {
      this.ticketsStore.setFilters(newFilters)
      this.fetchTickets(1)
    },
    handleViewTicket(id) {
      this.$router.push(`/tickets/${id}`)
    },
    async handleClassifyTicket(id) {
      console.log('TicketsView: Starting classification for ticket:', id)
      this.classifyingTicketId = id
      try {
        await this.ticketsStore.classifyTicket(id)
        console.log('TicketsView: Classification completed successfully')
        // Добавляем небольшую задержку, чтобы пользователь увидел "Classifying..."
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (err) {
        console.error('TicketsView: Classification failed:', err)
      } finally {
        this.classifyingTicketId = null
      }
    },
    handleTicketCreated() {
      this.showCreateModal = false
      this.fetchTickets(this.ticketsStore.currentPage)
    },
    goToPage(page) {
      if (page >= 1 && page <= this.ticketsStore.lastPage) {
        this.fetchTickets(page)
      }
    },
    fetchTickets(page) {
      return this.ticketsStore.fetchTickets(page)
    },
    setFilters(filters) {
      return this.ticketsStore.setFilters(filters)
    },
    clearError() {
      return this.ticketsStore.clearError()
    }
  },
  setup() {
    const ticketsStore = useTicketsStore()
    return {
      ticketsStore
    }
  }
}
</script>

<style scoped>
.tickets-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.tickets-view__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.tickets-view__title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.tickets-view__create-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.tickets-view__create-button:hover {
  background: #2563eb;
}

.tickets-view__create-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.tickets-view__loading,
.tickets-view__error,
.tickets-view__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.tickets-view__spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.tickets-view__error-icon,
.tickets-view__empty-icon {
  width: 3rem;
  height: 3rem;
  color: #6b7280;
  margin-bottom: 1rem;
}

.tickets-view__error {
  color: #dc2626;
}

.tickets-view__retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
}

.tickets-view__retry-button:hover {
  background: #b91c1c;
}

.tickets-view__empty h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.tickets-view__empty p {
  color: #6b7280;
  margin: 0 0 1.5rem 0;
}

.tickets-view__grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
}

.tickets-view__pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
}

.tickets-view__pagination-info {
  color: #6b7280;
  font-size: 0.875rem;
}

.tickets-view__pagination-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.tickets-view__pagination-button {
  padding: 0.5rem 1rem;
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tickets-view__pagination-button:hover:not(:disabled) {
  background: #f3f4f6;
}

.tickets-view__pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tickets-view__pagination-page {
  font-size: 0.875rem;
  color: #6b7280;
}

@media (max-width: 768px) {
  .tickets-view__header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .tickets-view__pagination {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
