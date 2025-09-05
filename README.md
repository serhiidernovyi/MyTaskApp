# Smart Ticket Triage - Frontend

Vue 3 frontend application for the Smart Ticket Triage system with AI-powered classification and analytics.

## Features

- **Dashboard**: Real-time statistics and charts
- **Ticket Management**: Create, view, update, and filter support tickets
- **AI Classification**: Automatic ticket categorization using OpenAI GPT
- **Analytics**: Interactive charts and data visualization
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Vue 3** with Composition API and TypeScript
- **Vite** for fast development and building
- **Pinia** for state management
- **Vue Router** for navigation
- **Chart.js** for data visualization
- **Heroicons** for icons
- **BEM CSS** methodology for styling
- **Axios** for API communication

## Project Structure

```
src/
├── api/                 # API services
│   └── tickets.ts      # Ticket API client
├── components/         # Reusable components
│   ├── Charts/         # Chart components
│   ├── Layout/         # Layout components
│   └── Ticket/         # Ticket-related components
├── stores/             # Pinia stores
│   ├── tickets.ts      # Ticket state management
│   └── stats.ts        # Statistics state management
├── views/              # Page components
│   ├── DashboardView.vue
│   └── TicketsView.vue
├── router/             # Vue Router configuration
└── main.ts            # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on http://localhost:8000

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   ```
   http://localhost:5173
   ```

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## API Integration

The frontend communicates with the Laravel backend API:

- **Base URL**: `http://localhost:8000/api`
- **Endpoints**:
  - `GET /tickets` - List tickets with pagination and filters
  - `POST /tickets` - Create new ticket
  - `GET /tickets/{id}` - Get ticket details
  - `PATCH /tickets/{id}` - Update ticket
  - `POST /tickets/{id}/classify` - Classify ticket with AI
  - `GET /stats` - Get dashboard statistics

## Features Overview

### Dashboard
- Overview cards with key metrics
- Interactive charts for status and category distribution
- Daily activity trends
- Top issues analysis
- AI confidence metrics

### Ticket Management
- Grid view of all tickets
- Advanced filtering and search
- Pagination support
- Real-time classification
- Status and category management

### Responsive Design
- Mobile-first approach
- BEM CSS methodology
- Clean and modern UI
- Accessible components

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Code Style

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **BEM CSS** for styling methodology
- **Composition API** for Vue components

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.