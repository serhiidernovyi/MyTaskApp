# Smart Ticket Triage & Dashboard

A production-style single-page application that helps a help-desk team manage support tickets with AI-powered classification and analytics.

## Features

- **Ticket Management**: Create, view, and manage support tickets
- **AI Classification**: Automatic ticket categorization using OpenAI
- **Analytics Dashboard**: View ticket statistics and charts
- **Manual Override**: Override AI classifications and add internal notes
- **Filtering & Search**: Filter tickets by status, category, and search text
- **Responsive Design**: Clean, modern UI with BEM CSS methodology

## Tech Stack

### Frontend
- **Vue 3** with Options API (no Composition API, no TypeScript)
- **Vue Router** for navigation
- **Pinia** for state management
- **Axios** for API calls
- **Heroicons** for icons
- **Vite** for build tooling
- **BEM CSS** for styling

### Backend
- **Laravel 11** with PHP 8.2
- **MySQL** database
- **OpenAI API** for ticket classification
- **Laravel Queues** for background jobs

## Quick Setup

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 20.19.0+ or 22.12.0+
- MySQL 8.0+
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MyTaskApp
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your database and OpenAI configuration
   ```

5. **Database setup**
   ```bash
   php artisan migrate --seed
   ```

6. **Start development servers**
   ```bash
   # Terminal 1: Start Laravel backend
   php artisan serve
   
   # Terminal 2: Start Vue frontend
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000/api

## Project Structure

```
src/
├── api/                 # API client functions
│   └── tickets.js      # Ticket API calls
├── components/         # Vue components
│   ├── Charts/         # Chart components
│   ├── Layout/         # Layout components
│   └── Ticket/         # Ticket-related components
├── router/             # Vue Router configuration
│   └── index.js
├── stores/             # Pinia stores
│   ├── tickets.js      # Ticket state management
│   └── stats.js        # Statistics state management
├── views/              # Page components
│   ├── DashboardView.vue
│   ├── TicketDetailView.vue
│   └── TicketsView.vue
├── assets/             # Static assets
├── App.vue             # Root component
└── main.js             # Application entry point
```

## API Endpoints

- `POST /api/tickets` - Create new ticket
- `GET /api/tickets` - List tickets with filtering and pagination
- `GET /api/tickets/{id}` - Get ticket details
- `PATCH /api/tickets/{id}` - Update ticket
- `POST /api/tickets/{id}/classify` - Trigger AI classification
- `GET /api/stats` - Get dashboard statistics

## Key Features

### Ticket Management
- Create tickets with subject, body, and status
- View ticket details in modal or dedicated page
- Filter tickets by status, category, and search text
- Pagination for large ticket lists

### AI Classification
- Automatic ticket categorization using OpenAI
- Confidence scoring and explanations
- Manual override capability
- Background job processing

### Analytics Dashboard
- Ticket count by status and category
- Visual charts for data representation
- Real-time statistics updates

## Development

### Available Scripts

```bash
# Development
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### BEM CSS Methodology

The project uses BEM (Block Element Modifier) naming convention:

```css
.ticket-card { }                    /* Block */
.ticket-card__header { }            /* Element */
.ticket-card__header--active { }    /* Modifier */
```

## Assumptions & Trade-offs

### Assumptions
- Users have basic knowledge of support ticket systems
- OpenAI API is available and configured
- Database is properly set up with required tables
- Modern browsers with ES6+ support

### Trade-offs
- **No TypeScript**: Chose JavaScript for simplicity and faster development
- **Options API**: Used Vue 3 Options API instead of Composition API for consistency
- **BEM CSS**: Chose BEM over CSS frameworks for better control and performance
- **Single Page Application**: All functionality in one SPA for better user experience
- **Background Jobs**: AI classification runs in background to avoid blocking UI

### What I'd do with more time
- Add comprehensive error handling and user feedback
- Implement real-time updates with WebSockets
- Add advanced filtering and sorting options
- Create comprehensive test suite
- Add dark/light theme toggle
- Implement CSV export functionality
- Add bulk operations for tickets
- Create admin panel for system configuration

## Environment Variables

```env
# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=my_task_app
DB_USERNAME=root
DB_PASSWORD=

# Queue
QUEUE_CONNECTION=database

# OpenAI
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_CLASSIFY_ENABLED=true

# App
APP_NAME="Smart Ticket Triage & Dashboard"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Frontend
VITE_API_URL=http://localhost:8000/api
```

## License

This project is part of a take-home task and is not intended for production use.