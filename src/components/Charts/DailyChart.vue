<template>
  <div class="daily-chart">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface DailyData {
  date: string
  created: number
  closed: number
}

interface Props {
  data: DailyData[]
}

const props = defineProps<Props>()

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: ChartJS | null = null

function createChart() {
  if (!chartCanvas.value) return

  const labels = props.data.map(item => {
    const date = new Date(item.date)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  })
  
  const createdData = props.data.map(item => item.created)
  const closedData = props.data.map(item => item.closed)

  chartInstance = new ChartJS(chartCanvas.value, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Created',
          data: createdData,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: 'Closed',
          data: closedData,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            title: (context) => {
              const dataIndex = context[0].dataIndex
              const date = new Date(props.data[dataIndex].date)
              return date.toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: '#e5e7eb'
          },
          ticks: {
            color: '#6b7280',
            maxTicksLimit: 10
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            color: '#6b7280'
          },
          grid: {
            color: '#e5e7eb'
          }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      }
    }
  })
}

function updateChart() {
  if (!chartInstance) return

  const labels = props.data.map(item => {
    const date = new Date(item.date)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  })
  
  const createdData = props.data.map(item => item.created)
  const closedData = props.data.map(item => item.closed)

  chartInstance.data.labels = labels
  chartInstance.data.datasets[0].data = createdData
  chartInstance.data.datasets[1].data = closedData
  chartInstance.update()
}

onMounted(() => {
  createChart()
})

watch(() => props.data, () => {
  updateChart()
}, { deep: true })
</script>

<style scoped>
.daily-chart {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
