<template>
  <div class="status-chart">
    <div v-if="!data || Object.keys(data).length === 0" class="status-chart__empty">
      No data available
    </div>
    <div v-else class="status-chart__simple">
      <div 
        v-for="(value, status) in data" 
        :key="status"
        class="status-chart__item"
      >
        <div 
          class="status-chart__bar"
          :style="{ 
            width: `${(value / maxValue) * 100}%`,
            backgroundColor: getStatusColor(status)
          }"
        ></div>
        <span class="status-chart__label">{{ getStatusLabel(status) }}: {{ value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  data: Record<string, number>
}

const props = defineProps<Props>()

const statusColors = {
  new: '#6b7280',
  open: '#3b82f6',
  pending: '#f59e0b',
  closed: '#10b981'
}

const statusLabels = {
  new: 'New',
  open: 'Open',
  pending: 'Pending',
  closed: 'Closed'
}

const maxValue = computed(() => {
  return Math.max(...Object.values(props.data || {}))
})

function getStatusColor(status: string): string {
  return statusColors[status as keyof typeof statusColors] || '#6b7280'
}

function getStatusLabel(status: string): string {
  return statusLabels[status as keyof typeof statusLabels] || status
}
</script>

<style scoped>
.status-chart {
  width: 100%;
  height: 100%;
  padding: 1rem;
}

.status-chart__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #6b7280;
  font-style: italic;
}

.status-chart__simple {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.status-chart__item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status-chart__bar {
  height: 20px;
  border-radius: 4px;
  min-width: 20px;
  transition: width 0.3s ease;
}

.status-chart__label {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
}
</style>
