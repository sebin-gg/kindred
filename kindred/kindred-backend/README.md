# Kindred Backend API

Node.js + Express + MongoDB backend for the Kindred community impact tracking application.

## Setup Instructions

### Prerequisites

- Node.js installed
- MongoDB running locally or MongoDB Atlas account

### Installation

1. Install dependencies:

```bash
npm install
```

1. Create `.env` file with your configuration (already created with defaults)

2. Start the server:

```bash
npm run dev  # Development with nodemon
npm start    # Production
```

The backend will run on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users

- `GET /api/users/profile` - Get user profile (requires token)
- `PUT /api/users/profile` - Update profile (requires token)
- `GET /api/users/tracks` - Get user tracks (requires token)
- `PUT /api/users/tracks/:trackName` - Update track points (requires token)

### Journal

- `POST /api/journal/entries` - Create journal entry (requires token)
- `GET /api/journal/entries` - Get user's journal entries (requires token)
- `DELETE /api/journal/entries/:entryId` - Delete journal entry (requires token)

### Community

- `GET /api/community/members` - Get community members (with optional filters)
- `GET /api/community/members/:userId` - Get specific community member
- `GET /api/community/stats` - Get community statistics

## Environment Variables

```bash
MONGODB_URI=mongodb://localhost:27017/kindred
JWT_SECRET=your_jwt_secret_key_here_change_in_production
PORT=5000
NODE_ENV=development
```

## Frontend Integration

Update your React app to call these endpoints. Example:

```javascript
const API_URL = 'http://localhost:5000/api';

// Login
const response = await fetch(`${API_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const { token } = await response.json();

// Use token for authenticated requests
const profileResponse = await fetch(`${API_URL}/users/profile`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## Database Models

- **User**: User profiles with tracks and preferences
- **JournalEntry**: User journal entries with categories and points

## Next Steps

1. Install MongoDB locally or create a free cluster at MongoDB Atlas
2. Update `.env` with your MongoDB connection string
3. Start the backend server
4. Integrate API calls in your React frontend
5. Implement authentication flow with JWT tokens
