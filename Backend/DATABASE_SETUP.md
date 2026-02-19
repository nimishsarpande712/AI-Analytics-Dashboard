# Database Setup Guide

## Prerequisites
- MySQL server installed and running
- Database created: `marketing_campaign`
- Database user with proper permissions

## Setup Steps

### 1. Install Dependencies
```bash
cd Backend
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and update with your database credentials:
```bash
cp .env.example .env
```

Update your `.env` file:
```env
NODE_ENV=development
PORT=5001
FRONTEND_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=marketing_campaign

# Other configurations...
```

### 3. Database Operations

#### Test Database Connection
```bash
npm start
```
This will test the database connection on server startup.

#### Create Tables
Tables will be created automatically when you run the seeder.

#### Seed Database from CSV
```bash
# Seed campaigns from CSV file
npm run db:seed

# Clear all campaigns
npm run db:clear

# Show database statistics
npm run db:stats
```

### 4. API Endpoints

Once seeded, you can access:

- `GET /api/campaigns` - Get all campaigns (with filtering)
- `GET /api/campaigns/:id` - Get single campaign
- `GET /api/campaigns/metrics` - Get metric cards
- `GET /api/campaigns/chart-data` - Get chart data
- `GET /api/campaigns/channels/performance` - Get channel performance
- `GET /api/campaigns/summary` - Get campaign summary

#### Query Parameters for /api/campaigns:
- `status` - Filter by status (active, paused, completed, draft)
- `channel` - Filter by channel name
- `limit` - Number of records to return (default: 50)
- `offset` - Number of records to skip (default: 0)

### 5. CSV File Format

Your `marketing_campaign.csv` should include these columns:
- campaign_id, campaign_name, channel, campaign_type
- target_audience, budget, spend, revenue
- impressions, clicks, conversions
- ctr, cpc, cpm, conversion_rate, roas, roi
- start_date, end_date, status
- geo_location, device_type, age_group, gender
- interests, ad_format, landing_page_url, notes

### 6. Database Schema

The Campaign model includes:
- Basic campaign info (id, name, channel, type)
- Budget and performance metrics
- Calculated fields (ROAS, ROI, CTR, etc.)
- Targeting information (audience, geo, demographics)
- Timestamps and status tracking

### 7. Error Handling

The system includes:
- Graceful fallback to mock data if database fails
- Data validation and transformation
- Comprehensive error logging
- Duplicate prevention during seeding

## Troubleshooting

### Database Connection Issues
1. Verify MySQL is running
2. Check database credentials in .env
3. Ensure database `marketing_campaign` exists
4. Verify user permissions

### Seeding Issues
1. Check CSV file path: `Backend/marketing_campaign.csv`
2. Verify CSV format matches expected columns
3. Check for data type mismatches
4. Review seeder logs for specific errors

### API Issues
1. Server falls back to mock data if database unavailable
2. Check server logs for database connection status
3. Verify table creation was successful
