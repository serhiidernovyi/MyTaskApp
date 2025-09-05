<template>
  <header class="app-header">
    <div class="app-header__container">
      <div class="app-header__brand">
        <h1 class="app-header__title">Smart Ticket Triage</h1>
        <p class="app-header__subtitle">AI-powered ticket management system</p>
      </div>
      
      <nav class="app-header__nav">
        <router-link 
          to="/" 
          class="app-header__link"
          :class="{ 'app-header__link--active': $route.path === '/' }"
        >
          <HomeIcon class="app-header__icon" />
          Dashboard
        </router-link>
        
        <router-link 
          to="/tickets" 
          class="app-header__link"
          :class="{ 'app-header__link--active': $route.path.startsWith('/tickets') }"
        >
          <TicketIcon class="app-header__icon" />
          Tickets
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script>
import { HomeIcon, TicketIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'AppHeader',
  components: {
    HomeIcon,
    TicketIcon
  }
}
</script>

<style scoped>
.app-header {
  background: #1f2937;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app-header__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-header__brand {
  display: flex;
  flex-direction: column;
}

.app-header__title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: #f9fafb;
}

.app-header__subtitle {
  font-size: 0.875rem;
  color: #d1d5db;
  margin: 0;
}

.app-header__nav {
  display: flex;
  gap: 1rem;
}

.app-header__link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  text-decoration: none;
  color: #d1d5db;
  transition: all 0.2s;
  font-weight: 500;
}

.app-header__link:hover {
  background: #374151;
  color: #f9fafb;
}

.app-header__link--active {
  background: #3b82f6;
  color: white;
}

.app-header__icon {
  width: 1.25rem;
  height: 1.25rem;
}
</style>


