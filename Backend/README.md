# AI-Analytics-Dashboard Backend

This is the backend API server for the AI-Powered Analytics Dashboard built with Node.js and Express.js.

## Features

- RESTful API endpoints
- Authentication & Authorization
- Data analytics and visualization endpoints
- Report generation
- Real-time data processing
- Error handling and logging
- Rate limiting and security middleware

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (when connected)
- **JWT** - Authentication
- **Helmet** - Security middleware
- **Morgan** - Logging
- **CORS** - Cross-origin resource sharing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (optional for full functionality)

### Installation

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration values.

5. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Production Build

```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Dashboard
- `GET /api/dashboard/overview` - Get dashboard overview data
- `GET /api/dashboard/widgets/:widgetId` - Get specific widget data

### Analytics
- `GET /api/analytics` - Get analytics data
- `GET /api/analytics/:metric` - Get specific metric data

### Reports
- `GET /api/reports` - Get all reports
- `POST /api/reports/generate` - Generate new report
- `GET /api/reports/:id` - Get specific report
- `GET /api/reports/:id/download` - Download report
- `GET /api/reports/scheduled/list` - Get scheduled reports

### Data Management
- `GET /api/data/sources` - Get data sources
- `POST /api/data/upload` - Upload data file
- `GET /api/data/export` - Export data
- `GET /api/data/visualization` - Get visualization data
- `POST /api/data/sync/:sourceId` - Sync data source

### Health Check
- `GET /health` - Server health status

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/ai-analytics-dashboard
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## Project Structure

```
Backend/
├── middleware/          # Custom middleware
│   ├── auth.js         # Authentication middleware
│   ├── errorHandler.js # Error handling middleware
│   └── notFound.js     # 404 handler
├── routes/             # API routes
│   ├── auth.js         # Authentication routes
│   ├── analytics.js    # Analytics routes
│   ├── dashboard.js    # Dashboard routes
│   ├── data.js         # Data management routes
│   └── reports.js      # Reports routes
├── .env.example        # Environment variables template
├── .gitignore         # Git ignore file
├── package.json       # Dependencies and scripts
├── README.md          # This file
└── server.js          # Main server file
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
