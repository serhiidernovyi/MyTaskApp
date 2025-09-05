<template>
  <div class="ticket-filters">
    <div class="ticket-filters__container">
      <div class="ticket-filters__controls">
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
        
        <div class="ticket-filters__divider"></div>
        
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
          <option value="support">Support</option>
          <option value="question">Question</option>
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
          class="ticket-filters__date"
          @change="applyFilters"
        />
        
        <button 
          v-if="hasActiveFilters"
          @click="clearFilters"
          class="ticket-filters__clear"
        >
          Clear Filters
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'TicketFilters',
  components: {
    MagnifyingGlassIcon
  },
  props: {
    filters: {
      type: Object,
      required: true
    }
  },
  emits: ['update:filters'],
  data() {
    return {
      localFilters: { ...this.filters },
      searchTimeout: null
    }
  },
  computed: {
    hasActiveFilters() {
      return this.localFilters.status !== '' ||
             this.localFilters.category !== '' ||
             this.localFilters.search !== '' ||
             this.localFilters.sort_created_at !== 'DESC' ||
             this.localFilters.created_at !== ''
    }
  },
  watch: {
    filters: {
      handler(newFilters) {
        this.localFilters = { ...newFilters }
      },
      deep: true
    }
  },
  methods: {
    debouncedSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
      
      this.searchTimeout = setTimeout(() => {
        this.applyFilters()
      }, 500)
    },
    applyFilters() {
      this.$emit('update:filters', { ...this.localFilters })
    },
    clearFilters() {
      this.localFilters = {
        status: '',
        category: '',
        search: '',
        sort_created_at: 'DESC',
        created_at: ''
      }
      this.applyFilters()
    }
  }
}
</script>

<style scoped>
.ticket-filters {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 0;
  margin-bottom: 1rem;
}

.ticket-filters__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.ticket-filters__search-input {
  position: relative;
  max-width: 300px;
}

.ticket-filters__divider {
  flex: 1;
  height: 2rem;
  background-color: transparent;
  margin: 0 1rem;
  flex-shrink: 0;
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
  padding: 0.5rem 0.75rem 0.5rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
  height: 2.5rem;
  box-sizing: border-box;
}

.ticket-filters__input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.ticket-filters__controls {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
}

.ticket-filters__select,
.ticket-filters__date {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: white;
  transition: border-color 0.2s;
  height: 2.5rem;
  box-sizing: border-box;
}

.ticket-filters__select:focus,
.ticket-filters__date:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.ticket-filters__clear {
  padding: 0.5rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  height: 2.5rem;
  box-sizing: border-box;
}

.ticket-filters__clear:hover {
  background: #dc2626;
}

@media (max-width: 640px) {
  .ticket-filters__controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .ticket-filters__select,
  .ticket-filters__date,
  .ticket-filters__clear {
    width: 100%;
  }
}
</style>