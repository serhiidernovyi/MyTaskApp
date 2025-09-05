<template>
  <div class="dashboard">
    <div class="dashboard__header">
      <h1 class="dashboard__title">Dashboard</h1>
      <button 
        @click="refreshStats"
        class="dashboard__refresh"
        :disabled="loading"
      >
        <ArrowPathIcon 
          class="dashboard__refresh-icon"
          :class="{ 'dashboard__refresh-icon--spinning': loading }"
        />
        Refresh
      </button>
    </div>

    <div v-if="statsStore.error" class="dashboard__error">
      <ExclamationTriangleIcon class="dashboard__error-icon" />
      <p>{{ statsStore.error }}</p>
      <button @click="refreshStats" class="dashboard__retry-button">
        Try Again
      </button>
    </div>

    <div v-else class="dashboard__content">
      <!-- Overview Cards -->
      <div class="dashboard__overview">
        <div class="dashboard__card">
          <div class="dashboard__card-icon dashboard__card-icon--blue">
            <TicketIcon class="dashboard__card-icon-svg" />
          </div>
          <div class="dashboard__card-content">
            <h3 class="dashboard__card-title">Total Tickets</h3>
            <p class="dashboard__card-value">{{ statsStore.totalTickets }}</p>
          </div>
        </div>

        <div class="dashboard__card">
          <div class="dashboard__card-icon dashboard__card-icon--yellow">
            <QuestionMarkCircleIcon class="dashboard__card-icon-svg" />
          </div>
          <div class="dashboard__card-content">
            <h3 class="dashboard__card-title">Unclassified</h3>
            <p class="dashboard__card-value">{{ statsStore.unclassifiedCount }}</p>
          </div>
        </div>

        <div class="dashboard__card">
          <div class="dashboard__card-icon dashboard__card-icon--green">
            <CpuChipIcon class="dashboard__card-icon-svg" />
          </div>
          <div class="dashboard__card-content">
            <h3 class="dashboard__card-title">AI Classified</h3>
            <p class="dashboard__card-value">{{ statsStore.aiClassifications }}</p>
          </div>
        </div>

        <div class="dashboard__card">
          <div class="dashboard__card-icon dashboard__card-icon--purple">
            <UserIcon class="dashboard__card-icon-svg" />
          </div>
          <div class="dashboard__card-content">
            <h3 class="dashboard__card-title">Manual</h3>
            <p class="dashboard__card-value">{{ statsStore.manualClassifications }}</p>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="dashboard__charts">
        <div class="dashboard__chart-card">
          <h3 class="dashboard__chart-title">Tickets by Status</h3>
          <div class="dashboard__chart">
            <StatusChart :data="statsStore.statuses" />
          </div>
        </div>

        <div class="dashboard__chart-card">
          <h3 class="dashboard__chart-title">Tickets by Category</h3>
          <div class="dashboard__chart">
            <CategoryChart :data="statsStore.categories" />
          </div>
        </div>
      </div>

      <!-- Daily Stats and Top Issues -->
      <div class="dashboard__bottom">
        <div class="dashboard__chart-card">
          <h3 class="dashboard__chart-title">Daily Activity (Last 30 Days)</h3>
          <div class="dashboard__chart">
            <div style="padding: 2rem; text-align: center; color: #6b7280;">
              Daily activity chart coming soon...
            </div>
          </div>
        </div>

        <div class="dashboard__chart-card">
          <h3 class="dashboard__chart-title">Top Issues</h3>
          <div class="dashboard__top-issues">
            <div 
              v-for="issue in statsStore.topIssues" 
              :key="issue.category"
              class="dashboard__issue"
            >
              <div class="dashboard__issue-info">
                <span class="dashboard__issue-category">{{ issue.category }}</span>
                <span class="dashboard__issue-count">{{ issue.count }} tickets</span>
              </div>
              <div class="dashboard__issue-bar">
                <div 
                  class="dashboard__issue-progress"
                  :style="{ width: `${issue.percentage}%` }"
                ></div>
              </div>
              <span class="dashboard__issue-percentage">{{ issue.percentage }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Confidence -->
      <div v-if="statsStore.avgConfidence > 0" class="dashboard__confidence">
        <div class="dashboard__confidence-card">
          <h3 class="dashboard__confidence-title">AI Confidence</h3>
          <div class="dashboard__confidence-content">
            <div class="dashboard__confidence-value">
              {{ Math.round(statsStore.avgConfidence * 100) }}%
            </div>
            <div class="dashboard__confidence-bar">
              <div 
                class="dashboard__confidence-progress"
                :style="{ width: `${statsStore.avgConfidence * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  ArrowPathIcon, 
  ExclamationTriangleIcon, 
  TicketIcon, 
  QuestionMarkCircleIcon,
  CpuChipIcon,
  UserIcon
} from '@heroicons/vue/24/outline'
import { useStatsStore } from '@/stores/stats.js'
import StatusChart from '@/components/Charts/StatusChart.vue'
import CategoryChart from '@/components/Charts/CategoryChart.vue'

export default {
  name: 'DashboardView',
  components: {
    ArrowPathIcon,
    ExclamationTriangleIcon,
    TicketIcon,
    QuestionMarkCircleIcon,
    CpuChipIcon,
    UserIcon,
    StatusChart,
    CategoryChart
  },
  computed: {
    loading() {
      return this.statsStore.loading
    }
  },
  mounted() {
    this.fetchStats()
  },
  methods: {
    refreshStats() {
      this.fetchStats()
    },
    fetchStats() {
      return this.statsStore.fetchStats()
    }
  },
  setup() {
    const statsStore = useStatsStore()
    return {
      statsStore
    }
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.dashboard__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.dashboard__title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.dashboard__refresh {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.dashboard__refresh:hover:not(:disabled) {
  background: #e5e7eb;
}

.dashboard__refresh:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dashboard__refresh-icon {
  width: 1.25rem;
  height: 1.25rem;
  transition: transform 0.2s;
}

.dashboard__refresh-icon--spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.dashboard__loading,
.dashboard__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.dashboard__spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.dashboard__error-icon {
  width: 3rem;
  height: 3rem;
  color: #dc2626;
  margin-bottom: 1rem;
}

.dashboard__retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
}

.dashboard__retry-button:hover {
  background: #b91c1c;
}

.dashboard__overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.dashboard__card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.dashboard__card-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dashboard__card-icon--blue {
  background: #dbeafe;
  color: #1e40af;
}

.dashboard__card-icon--yellow {
  background: #fef3c7;
  color: #d97706;
}

.dashboard__card-icon--green {
  background: #d1fae5;
  color: #059669;
}

.dashboard__card-icon--purple {
  background: #e9d5ff;
  color: #7c3aed;
}

.dashboard__card-icon-svg {
  width: 1.5rem;
  height: 1.5rem;
}

.dashboard__card-content {
  flex: 1;
}

.dashboard__card-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  margin: 0 0 0.25rem 0;
}

.dashboard__card-value {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.dashboard__charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.dashboard__chart-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.dashboard__chart-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
}

.dashboard__chart {
  height: 300px;
}

.dashboard__bottom {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.dashboard__top-issues {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dashboard__issue {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.dashboard__issue-info {
  display: flex;
  flex-direction: column;
  min-width: 120px;
}

.dashboard__issue-category {
  font-weight: 500;
  color: #111827;
  text-transform: capitalize;
}

.dashboard__issue-count {
  font-size: 0.875rem;
  color: #6b7280;
}

.dashboard__issue-bar {
  flex: 1;
  height: 0.5rem;
  background: #e5e7eb;
  border-radius: 0.25rem;
  overflow: hidden;
}

.dashboard__issue-progress {
  height: 100%;
  background: #3b82f6;
  transition: width 0.3s;
}

.dashboard__issue-percentage {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  min-width: 3rem;
  text-align: right;
}

.dashboard__confidence {
  margin-top: 1.5rem;
}

.dashboard__confidence-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.dashboard__confidence-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
}

.dashboard__confidence-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.dashboard__confidence-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  min-width: 4rem;
}

.dashboard__confidence-bar {
  flex: 1;
  height: 0.75rem;
  background: #e5e7eb;
  border-radius: 0.375rem;
  overflow: hidden;
}

.dashboard__confidence-progress {
  height: 100%;
  background: linear-gradient(90deg, #ef4444 0%, #f59e0b 50%, #10b981 100%);
  transition: width 0.3s;
}

@media (max-width: 768px) {
  .dashboard__overview {
    grid-template-columns: 1fr;
  }
  
  .dashboard__charts {
    grid-template-columns: 1fr;
  }
  
  .dashboard__bottom {
    grid-template-columns: 1fr;
  }
  
  .dashboard__confidence-content {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
