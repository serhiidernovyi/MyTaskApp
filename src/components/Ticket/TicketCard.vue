<template>
  <div class="ticket-card">
    <div class="ticket-card__header">
      <h3 class="ticket-card__title">{{ ticket.subject }}</h3>
      <div class="ticket-card__badges">
        <span 
          class="ticket-card__badge ticket-card__badge--status"
          :class="`ticket-card__badge--status-${ticket.status}`"
        >
          {{ getStatusLabel(ticket.status) }}
        </span>
        <span 
          v-if="ticket.category"
          class="ticket-card__badge ticket-card__badge--category"
        >
          {{ ticket.category }}
        </span>
        <span 
          v-if="ticket.confidence"
          class="ticket-card__badge ticket-card__badge--confidence"
        >
          {{ Math.round(ticket.confidence * 100) }}%
        </span>
      </div>
    </div>
    
    <div class="ticket-card__body">
      <p class="ticket-card__description">{{ truncateText(ticket.body, 150) }}</p>
      
      <div v-if="ticket.explanation" class="ticket-card__explanation">
        <strong>AI Explanation:</strong> {{ ticket.explanation }}
      </div>
      
      <div v-if="ticket.note" class="ticket-card__note">
        <strong>Note:</strong> {{ ticket.note }}
      </div>
    </div>
    
    <div class="ticket-card__footer">
      <div class="ticket-card__meta">
        <span class="ticket-card__date">
          {{ formatDate(ticket.created_at) }}
        </span>
        <span v-if="ticket.category_is_manual" class="ticket-card__manual">
          Manual
        </span>
      </div>
      
      <div class="ticket-card__actions">
        <button 
          @click="$emit('view', ticket.id)"
          class="ticket-card__button ticket-card__button--primary"
        >
          View
        </button>
        <button 
          v-if="!ticket.category"
          @click="$emit('classify', ticket.id)"
          class="ticket-card__button ticket-card__button--secondary"
          :disabled="loading"
        >
          {{ loading ? 'Classifying...' : 'Classify' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Ticket } from '@/api/tickets'

interface Props {
  ticket: Ticket
  loading?: boolean
}

defineProps<Props>()

defineEmits<{
  view: [id: string]
  classify: [id: string]
}>()

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    new: 'New',
    open: 'Open',
    pending: 'Pending',
    closed: 'Closed'
  }
  return labels[status] || status
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.ticket-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s;
}

.ticket-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.ticket-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.ticket-card__title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  flex: 1;
}

.ticket-card__badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.ticket-card__badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.ticket-card__badge--status {
  color: white;
}

.ticket-card__badge--status-new {
  background: #6b7280;
}

.ticket-card__badge--status-open {
  background: #3b82f6;
}

.ticket-card__badge--status-pending {
  background: #f59e0b;
}

.ticket-card__badge--status-closed {
  background: #10b981;
}

.ticket-card__badge--category {
  background: #e5e7eb;
  color: #374151;
}

.ticket-card__badge--confidence {
  background: #dbeafe;
  color: #1e40af;
}

.ticket-card__body {
  margin-bottom: 1rem;
}

.ticket-card__description {
  color: #6b7280;
  line-height: 1.5;
  margin: 0 0 0.75rem 0;
}

.ticket-card__explanation,
.ticket-card__note {
  font-size: 0.875rem;
  padding: 0.5rem;
  background: #f9fafb;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
}

.ticket-card__explanation {
  border-left: 3px solid #3b82f6;
}

.ticket-card__note {
  border-left: 3px solid #f59e0b;
}

.ticket-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.ticket-card__meta {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.ticket-card__date {
  font-size: 0.875rem;
  color: #6b7280;
}

.ticket-card__manual {
  font-size: 0.75rem;
  color: #f59e0b;
  font-weight: 500;
}

.ticket-card__actions {
  display: flex;
  gap: 0.5rem;
}

.ticket-card__button {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.ticket-card__button--primary {
  background: #3b82f6;
  color: white;
}

.ticket-card__button--primary:hover {
  background: #2563eb;
}

.ticket-card__button--secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.ticket-card__button--secondary:hover {
  background: #e5e7eb;
}

.ticket-card__button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
