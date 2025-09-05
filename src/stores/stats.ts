import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ticketsApi, type StatsResponse } from '@/api/tickets'

export const useStatsStore = defineStore('stats', () => {
  // State
  const stats = ref<StatsResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const categories = computed(() => stats.value?.categories || {})
  const statuses = computed(() => stats.value?.statuses || {})
  const dailyStats = computed(() => stats.value?.daily_stats || [])
  const overview = computed(() => stats.value?.overview || {
    total_tickets: 0,
    unclassified: 0,
    manual_classifications: 0,
    ai_classifications: 0,
    avg_confidence: 0
  })
  const topIssues = computed(() => stats.value?.top_issues || [])

  // Computed для удобства
  const totalTickets = computed(() => overview.value.total_tickets)
  const unclassifiedCount = computed(() => overview.value.unclassified)
  const manualClassifications = computed(() => overview.value.manual_classifications)
  const aiClassifications = computed(() => overview.value.ai_classifications)
  const avgConfidence = computed(() => overview.value.avg_confidence)

  // Actions
  async function fetchStats() {
    loading.value = true
    error.value = null
    
    try {
      stats.value = await ticketsApi.getStats()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка загрузки статистики'
      console.error('Error fetching stats:', err)
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    stats,
    loading,
    error,
    
    // Getters
    categories,
    statuses,
    dailyStats,
    overview,
    topIssues,
    totalTickets,
    unclassifiedCount,
    manualClassifications,
    aiClassifications,
    avgConfidence,
    
    // Actions
    fetchStats,
    clearError
  }
})
