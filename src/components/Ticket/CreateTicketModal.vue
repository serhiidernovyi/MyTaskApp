<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="modal" @click.stop>
      <div class="modal__header">
        <h2 class="modal__title">Create New Ticket</h2>
        <button @click="$emit('close')" class="modal__close">
          <XMarkIcon class="modal__close-icon" />
        </button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="modal__form">
        <div class="modal__field">
          <label for="subject" class="modal__label">Subject *</label>
          <input
            id="subject"
            v-model="form.subject"
            type="text"
            class="modal__input"
            :class="{ 'modal__input--error': errors.subject }"
            placeholder="Enter ticket subject"
            required
          />
          <span v-if="errors.subject" class="modal__error">{{ errors.subject }}</span>
        </div>
        
        <div class="modal__field">
          <label for="body" class="modal__label">Description *</label>
          <textarea
            id="body"
            v-model="form.body"
            class="modal__textarea"
            :class="{ 'modal__textarea--error': errors.body }"
            placeholder="Describe the issue or request"
            rows="4"
            required
          ></textarea>
          <span v-if="errors.body" class="modal__error">{{ errors.body }}</span>
        </div>
        
        <div class="modal__field">
          <label for="status" class="modal__label">Status</label>
          <select id="status" v-model="form.status" class="modal__select">
            <option value="new">New</option>
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        
        <div class="modal__actions">
          <button 
            type="button" 
            @click="$emit('close')"
            class="modal__button modal__button--secondary"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            :disabled="loading || !isFormValid"
            class="modal__button modal__button--primary"
          >
            {{ loading ? 'Creating...' : 'Create Ticket' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useTicketsStore } from '@/stores/tickets.js'

export default {
  name: 'CreateTicketModal',
  components: {
    XMarkIcon
  },
  emits: ['close', 'created'],
  data() {
    return {
      form: {
        subject: '',
        body: '',
        status: 'new'
      },
      errors: {},
      loading: false
    }
  },
  computed: {
    isFormValid() {
      return this.form.subject.trim().length > 0 && 
             this.form.body.trim().length > 0
    }
  },
  methods: {
    validateForm() {
      this.errors = {}
      
      if (!this.form.subject.trim()) {
        this.errors.subject = 'Subject is required'
      }
      
      if (!this.form.body.trim()) {
        this.errors.body = 'Description is required'
      }
      
      return Object.keys(this.errors).length === 0
    },
    async handleSubmit() {
      if (!this.validateForm()) return
      
      this.loading = true
      
      try {
        await this.ticketsStore.createTicket({
          subject: this.form.subject.trim(),
          body: this.form.body.trim(),
          status: this.form.status
        })
        
        this.$emit('created')
      } catch (err) {
        console.error('Failed to create ticket:', err)
      } finally {
        this.loading = false
      }
    },
    handleOverlayClick() {
      if (!this.loading) {
        this.$emit('close')
      }
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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 0 1.5rem;
}

.modal__title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.modal__close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  color: #6b7280;
  transition: all 0.2s;
}

.modal__close:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal__close-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.modal__form {
  padding: 1.5rem;
}

.modal__field {
  margin-bottom: 1.5rem;
}

.modal__label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.modal__input,
.modal__textarea,
.modal__select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.modal__input:focus,
.modal__textarea:focus,
.modal__select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.modal__input--error,
.modal__textarea--error {
  border-color: #dc2626;
}

.modal__textarea {
  resize: vertical;
  min-height: 100px;
}

.modal__error {
  display: block;
  font-size: 0.75rem;
  color: #dc2626;
  margin-top: 0.25rem;
}

.modal__actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.modal__button {
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.modal__button--secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.modal__button--secondary:hover {
  background: #e5e7eb;
}

.modal__button--primary {
  background: #3b82f6;
  color: white;
}

.modal__button--primary:hover:not(:disabled) {
  background: #2563eb;
}

.modal__button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>


