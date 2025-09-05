<template>
  <div class="category-chart">
    <div v-if="!data || Object.keys(data).length === 0" class="category-chart__empty">
      No data available
    </div>
    <div v-else class="category-chart__simple">
      <div 
        v-for="(value, category) in data" 
        :key="category"
        class="category-chart__item"
      >
        <div 
          class="category-chart__bar"
          :style="{ 
            width: `${(value / maxValue) * 100}%`,
            backgroundColor: getCategoryColor(category)
          }"
        ></div>
        <span class="category-chart__label">{{ getCategoryLabel(category) }}: {{ value }}</span>
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

const categoryColors = {
  bug: '#ef4444',
  feature: '#3b82f6',
  question: '#f59e0b',
  complaint: '#dc2626',
  compliment: '#10b981',
  general: '#6b7280'
}

const maxValue = computed(() => {
  return Math.max(...Object.values(props.data || {}))
})

function getCategoryColor(category: string): string {
  return categoryColors[category as keyof typeof categoryColors] || '#6b7280'
}

function getCategoryLabel(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1)
}
</script>

<style scoped>
.category-chart {
  width: 100%;
  height: 100%;
  padding: 1rem;
}

.category-chart__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #6b7280;
  font-style: italic;
}

.category-chart__simple {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.category-chart__item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.category-chart__bar {
  height: 20px;
  border-radius: 4px;
  min-width: 20px;
  transition: width 0.3s ease;
}

.category-chart__label {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
}
</style>
