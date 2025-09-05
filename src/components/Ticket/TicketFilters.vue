<template>
  <div class="ticket-filters">
    <div class="ticket-filters__container">
      <div class="ticket-filters__search">
        <div class="ticket-filters__search-input">
          <MagnifyingGlassIcon class="ticket-filters__search-icon" />
          <input
            v-model="localFilters.search"
            type="text"
            placeholder="Search tickets..."
            class="ticket-filters__input"
            @input="debouncedSearch"
          />
        </div>
      </div>
      
      <div class="ticket-filters__controls">
        <select 
          v-model="localFilters.status"
          class="ticket-filters__select"
          @change="applyFilters"
        >
          <option value="">All Statuses</option>
          <option value="new">New</option>
          <option value="open">Open</option>
          <option value="pending">Pending</option>
          <option value="closed">Closed</option>
        </select>
        
        <select 
          v-model="localFilters.category"
          class="ticket-filters__select"
          @change="applyFilters"
        >
          <option value="">All Categories</option>
          <option value="bug">Bug</option>
          <option value="feature">Feature</option>
          <option value="question">Question</option>
          <option value="complaint">Complaint</option>
          <option value="compliment">Compliment</option>
          <option value="general">General</option>
        </select>
        
        <select 
          v-model="localFilters.sort_created_at"
          class="ticket-filters__select"
          @change="applyFilters"
        >
          <option value="DESC">Newest First</option>
          <option value="ASC">Oldest First</option>
        </select>
        
        <input
          v-model="localFilters.created_at"
          type="date"
          class="ticket-filters__input"
          placeholder="Filter by date"
          @change="applyFilters"
        />
        
        <button 
          @click="clearFilters"
          class="ticket-filters__clear"
          :disabled="!hasActiveFilters"
        >
          Clear Filters
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

interface Props {
  filters: {
    status: string
    category: string
    search: string
    sort_created_at: 'ASC' | 'DESC'
    created_at: string
  }
}

interface Emits {
  (e: 'update:filters', filters: Props['filters']): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localFilters = ref({ ...props.filters })

let searchTimeout: NodeJS.Timeout | null = null

const hasActiveFilters = computed(() => {
  return localFilters.value.status !== '' ||
         localFilters.value.category !== '' ||
         localFilters.value.search !== '' ||
         localFilters.value.sort_created_at !== 'DESC' ||
         localFilters.value.created_at !== ''
})

function debouncedSearch() {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    applyFilters()
  }, 500)
}

function applyFilters() {
  emit('update:filters', { ...localFilters.value })
}

function clearFilters() {
  localFilters.value = {
    status: '',
    category: '',
    search: '',
    sort_created_at: 'DESC',
    created_at: ''
  }
  applyFilters()
}

// Синхронизируем с внешними фильтрами
watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })
</script>

<style scoped>
.ticket-filters {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.ticket-filters__container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ticket-filters__search {
  flex: 1;
}

.ticket-filters__search-input {
  position: relative;
  max-width: 400px;
}

.ticket-filters__search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #6b7280;
}

.ticket-filters__input {
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.ticket-filters__input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.ticket-filters__input[type="date"] {
  min-width: 115px;
  max-width: 135px;
  height: 2.5rem;
  padding: 0.5rem 0.75rem;
}

.ticket-filters__controls {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
}

.ticket-filters__select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: white;
  min-width: 120px;
  transition: border-color 0.2s;
}

.ticket-filters__select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.ticket-filters__clear {
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.ticket-filters__clear:hover:not(:disabled) {
  background: #e5e7eb;
}

.ticket-filters__clear:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (min-width: 768px) {
  .ticket-filters__container {
    flex-direction: row;
    align-items: center;
  }
  
  .ticket-filters__search {
    flex: 1;
  }
}
</style>
