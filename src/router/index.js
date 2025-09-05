import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import TicketsView from '@/views/TicketsView.vue'
import TicketDetailView from '@/views/TicketDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/tickets',
      name: 'tickets',
      component: TicketsView
    },
    {
      path: '/tickets/:id',
      name: 'ticket-detail',
      component: TicketDetailView
    }
  ]
})

export default router