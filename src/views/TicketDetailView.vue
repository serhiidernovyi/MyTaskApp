<template>
  <div class="ticket-detail">
    <div v-if="loading" class="ticket-detail__loading">
      <div class="ticket-detail__spinner"></div>
      <p>Loading ticket...</p>
    </div>

    <div v-else-if="error" class="ticket-detail__error">
      <ExclamationTriangleIcon class="ticket-detail__error-icon" />
      <p>{{ error }}</p>
      <button @click="fetchTicket" class="ticket-detail__retry-button">
        Try Again
      </button>
    </div>

    <div v-else-if="ticket" class="ticket-detail__content">
      <!-- Header -->
      <div class="ticket-detail__header">
        <div class="ticket-detail__back">
          <button @click="goBack" class="ticket-detail__back-button">
            <ArrowLeftIcon class="ticket-detail__back-icon" />
            Back to Tickets
          </button>
        </div>
        
        <div class="ticket-detail__actions">
          <button 
            v-if="!ticket.category_is_manual"
            @click="handleClassify"
            :disabled="classifying"
            class="ticket-detail__action-button ticket-detail__action-button--secondary"
            data-testid="classify-ai-button"
          >
            <CpuChipIcon class="ticket-detail__action-icon" />
            {{ classifying ? 'Classifying...' : 'Classify with AI' }}
          </button>
          
          <button 
            @click="toggleEdit"
            class="ticket-detail__action-button ticket-detail__action-button--primary"
            data-testid="edit-button"
          >
            <PencilIcon class="ticket-detail__action-icon" />
            {{ isEditing ? 'Cancel Edit' : 'Edit Ticket' }}
          </button>
        </div>
      </div>

      <!-- Ticket Content -->
      <div class="ticket-detail__card">
        <div class="ticket-detail__card-header">
          <h1 class="ticket-detail__title">
            <input 
              v-if="isEditing"
              v-model="editForm.subject"
              class="ticket-detail__title-input"
              type="text"
            />
            <span v-else>{{ ticket.subject }}</span>
          </h1>
          
          <div class="ticket-detail__badges">
            <span 
              class="ticket-detail__badge ticket-detail__badge--status"
              :class="`ticket-detail__badge--status-${ticket.status}`"
            >
              <select 
                v-if="isEditing"
                v-model="editForm.status"
                class="ticket-detail__status-select"
              >
                <option value="new">New</option>
                <option value="open">Open</option>
                <option value="pending">Pending</option>
                <option value="closed">Closed</option>
              </select>
              <span v-else>{{ getStatusLabel(ticket.status) }}</span>
            </span>
            
            <span 
              v-if="ticket.category"
              class="ticket-detail__badge ticket-detail__badge--category"
            >
              {{ ticket.category }}
            </span>
            
            <span 
              v-if="ticket.confidence"
              class="ticket-detail__badge ticket-detail__badge--confidence"
            >
              {{ Math.round(ticket.confidence * 100) }}%
            </span>
          </div>
        </div>

        <div class="ticket-detail__card-body">
          <div class="ticket-detail__section">
            <h3 class="ticket-detail__section-title">Description</h3>
            <textarea 
              v-if="isEditing"
              v-model="editForm.body"
              class="ticket-detail__textarea"
              rows="6"
            ></textarea>
            <p v-else class="ticket-detail__description">{{ ticket.body }}</p>
          </div>

          <div v-if="ticket.explanation" class="ticket-detail__section">
            <h3 class="ticket-detail__section-title">AI Explanation</h3>
            <div class="ticket-detail__explanation">
              {{ ticket.explanation }}
            </div>
          </div>

          <div class="ticket-detail__section">
            <h3 class="ticket-detail__section-title">Category</h3>
            <select 
              v-if="isEditing"
              v-model="editForm.category"
              class="ticket-detail__select"
            >
              <option value="">Select a category</option>
              <option value="bug">Bug</option>
              <option value="feature">Feature</option>
              <option value="question">Question</option>
              <option value="complaint">Complaint</option>
              <option value="compliment">Compliment</option>
              <option value="general">General</option>
            </select>
            <div v-else class="ticket-detail__category">
              {{ ticket.category || 'Not classified' }}
            </div>
          </div>

          <div class="ticket-detail__section">
            <h3 class="ticket-detail__section-title">Note</h3>
            <textarea 
              v-if="isEditing"
              v-model="editForm.note"
              class="ticket-detail__textarea"
              rows="3"
              placeholder="Add a note..."
            ></textarea>
            <div v-else class="ticket-detail__note">
              {{ ticket.note || 'No note added' }}
            </div>
          </div>
        </div>

        <div class="ticket-detail__card-footer">
          <div class="ticket-detail__meta">
            <span class="ticket-detail__date">
              Created: {{ formatDate(ticket.created_at) }}
            </span>
            <span v-if="ticket.updated_at !== ticket.created_at" class="ticket-detail__date">
              Updated: {{ formatDate(ticket.updated_at) }}
            </span>
            <span v-if="ticket.category_is_manual" class="ticket-detail__manual">
              Manual Classification
            </span>
            <span v-else-if="ticket.category && !ticket.category_is_manual" class="ticket-detail__ai">
              AI Classification
            </span>
          </div>

          <div v-if="isEditing" class="ticket-detail__edit-actions" data-testid="edit-form">
            <button 
              @click="cancelEdit"
              class="ticket-detail__edit-button ticket-detail__edit-button--secondary"
              data-testid="cancel-button"
            >
              Cancel
            </button>
            <button 
              @click="saveChanges"
              :disabled="saving"
              class="ticket-detail__edit-button ticket-detail__edit-button--primary"
              data-testid="save-button"
            >
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { useTicketsStore } from '@/stores/tickets.js'
import { 
  ArrowLeftIcon, 
  ExclamationTriangleIcon, 
  CpuChipIcon, 
  PencilIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'TicketDetailView',
  components: {
    ArrowLeftIcon,
    ExclamationTriangleIcon,
    CpuChipIcon,
    PencilIcon
  },
  data() {
    return {
      loading: false,
      error: null,
      ticket: null,
      isEditing: false,
      saving: false,
      classifying: false,
      editForm: {
        subject: '',
        body: '',
        status: 'new',
        category: '',
        note: ''
      }
    }
  },
  computed: {
    ticketId() {
      return this.$route.params.id
    }
  },
  mounted() {
    this.fetchTicket()
  },
  methods: {
    async fetchTicket() {
      this.loading = true
      this.error = null
      
      try {
        this.ticket = await this.ticketsStore.fetchTicket(this.ticketId)
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to load ticket'
        console.error('Error fetching ticket:', err)
      } finally {
        this.loading = false
      }
    },
    goBack() {
      this.$router.push('/tickets')
    },
    toggleEdit() {
      if (this.isEditing) {
        this.cancelEdit()
      } else {
        this.startEdit()
      }
    },
    startEdit() {
      if (this.ticket) {
        this.editForm = {
          subject: this.ticket.subject,
          body: this.ticket.body,
          status: this.ticket.status,
          category: this.ticket.category || '',
          note: this.ticket.note || ''
        }
        this.isEditing = true
      }
    },
    cancelEdit() {
      this.isEditing = false
      this.editForm = {
        subject: '',
        body: '',
        status: 'new',
        category: '',
        note: ''
      }
    },
    async saveChanges() {
      if (!this.ticket) return
      
      this.saving = true
      
      try {
        const updateData = {
          subject: this.editForm.subject,
          body: this.editForm.body,
          status: this.editForm.status,
          category: this.editForm.category,
          note: this.editForm.note
        }
        
        await this.ticketsStore.updateTicket(this.ticket.id, updateData)
        this.isEditing = false
        await this.fetchTicket() // Refresh the ticket data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to update ticket'
        console.error('Error updating ticket:', err)
      } finally {
        this.saving = false
      }
    },
    async handleClassify() {
      if (!this.ticket) return
      
      this.classifying = true
      
      try {
        console.log('Starting classification for ticket:', this.ticket.id)
        await this.ticketsStore.classifyTicket(this.ticket.id)
        console.log('Classification successful, refreshing ticket data')
        await this.fetchTicket() // Refresh the ticket data
      } catch (err) {
        console.error('Classification error details:', {
          message: err.message,
          response: err.response,
          status: err.response?.status,
          data: err.response?.data
        })
        // Обработка rate limiting
        if (err.response?.status === 429) {
          this.error = 'Too many requests. Please wait a moment and try again.'
        } else {
          this.error = err.response?.data?.message || err.message || 'Failed to classify ticket'
        }
      } finally {
        this.classifying = false
      }
    },
    getStatusLabel(status) {
      const labels = {
        new: 'New',
        open: 'Open',
        pending: 'Pending',
        closed: 'Closed'
      }
      return labels[status] || status
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
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
.ticket-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.ticket-detail__loading,
.ticket-detail__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.ticket-detail__spinner {
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

.ticket-detail__error-icon {
  width: 3rem;
  height: 3rem;
  color: #dc2626;
  margin-bottom: 1rem;
}

.ticket-detail__retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
}

.ticket-detail__retry-button:hover {
  background: #b91c1c;
}

.ticket-detail__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.ticket-detail__back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.ticket-detail__back-button:hover {
  background: #e5e7eb;
}

.ticket-detail__back-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.ticket-detail__actions {
  display: flex;
  gap: 0.75rem;
}

.ticket-detail__action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.ticket-detail__action-button--primary {
  background: #3b82f6;
  color: white;
}

.ticket-detail__action-button--primary:hover {
  background: #2563eb;
}

.ticket-detail__action-button--secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.ticket-detail__action-button--secondary:hover {
  background: #e5e7eb;
}

.ticket-detail__action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ticket-detail__action-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.ticket-detail__card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.ticket-detail__card-header {
  padding: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.ticket-detail__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1rem 0;
}

.ticket-detail__title-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1.5rem;
  font-weight: 700;
}

.ticket-detail__badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.ticket-detail__badge {
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.ticket-detail__badge--status {
  color: white;
}

.ticket-detail__badge--status-new {
  background: #6b7280;
}

.ticket-detail__badge--status-open {
  background: #3b82f6;
}

.ticket-detail__badge--status-pending {
  background: #f59e0b;
}

.ticket-detail__badge--status-closed {
  background: #10b981;
}

.ticket-detail__badge--category {
  background: #e5e7eb;
  color: #374151;
}

.ticket-detail__badge--confidence {
  background: #dbeafe;
  color: #1e40af;
}

.ticket-detail__status-select {
  background: transparent;
  border: none;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.ticket-detail__card-body {
  padding: 2rem;
}

.ticket-detail__section {
  margin-bottom: 2rem;
}

.ticket-detail__section:last-child {
  margin-bottom: 0;
}

.ticket-detail__section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
}

.ticket-detail__description {
  color: #374151;
  line-height: 1.6;
  margin: 0;
}

.ticket-detail__textarea,
.ticket-detail__select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  resize: vertical;
}

.ticket-detail__select {
  resize: none;
}

.ticket-detail__textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.ticket-detail__explanation {
  padding: 1rem;
  background: #f0f9ff;
  border-left: 4px solid #3b82f6;
  border-radius: 0.375rem;
  color: #374151;
  line-height: 1.6;
}

.ticket-detail__category {
  padding: 1rem;
  background: #f0f9ff;
  border-left: 4px solid #3b82f6;
  border-radius: 0.375rem;
  color: #374151;
  line-height: 1.6;
  font-weight: 500;
  text-transform: capitalize;
}

.ticket-detail__note {
  padding: 1rem;
  background: #f9fafb;
  border-left: 4px solid #f59e0b;
  border-radius: 0.375rem;
  color: #374151;
  line-height: 1.6;
  font-style: italic;
}

.ticket-detail__card-footer {
  padding: 2rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.ticket-detail__meta {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.ticket-detail__date {
  font-size: 0.875rem;
  color: #6b7280;
}

.ticket-detail__manual {
  font-size: 0.75rem;
  color: #f59e0b;
  font-weight: 500;
  background: #fef3c7;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  border: 1px solid #fbbf24;
  white-space: nowrap;
}

.ticket-detail__ai {
  font-size: 0.75rem;
  color: #059669;
  font-weight: 500;
  background: #d1fae5;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  border: 1px solid #10b981;
  white-space: nowrap;
}

.ticket-detail__edit-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.ticket-detail__edit-button {
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.ticket-detail__edit-button--primary {
  background: #3b82f6;
  color: white;
}

.ticket-detail__edit-button--primary:hover:not(:disabled) {
  background: #2563eb;
}

.ticket-detail__edit-button--secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.ticket-detail__edit-button--secondary:hover {
  background: #e5e7eb;
}

.ticket-detail__edit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .ticket-detail__header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .ticket-detail__actions {
    justify-content: center;
  }
  
  .ticket-detail__meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .ticket-detail__edit-actions {
    flex-direction: column;
  }
}
</style>
