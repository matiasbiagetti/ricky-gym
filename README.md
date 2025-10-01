# Ricky Gym - Full-Stack Gym Attendance Tracking App

A comprehensive full-stack web application designed to gamify and track gym attendance among friends. Built with modern web technologies and best practices.

## 🚀 Features

### Core Functionality
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **User Profiles**: Customizable profiles with photo uploads
- **Daily Check-ins**: Track gym visits with optional photos and notes
- **Leaderboards**: Competitive rankings with multiple time periods (week, month, year, all-time)
- **Friend System**: Connect with friends and track group progress
- **Personal Statistics**: Detailed analytics and insights
- **Group Statistics**: Compare performance with friends
- **Interactive Graphs**: Visual representation of progress using Recharts
- **Date Filters**: View data by custom date ranges
- **Photo Uploads**: Support for AWS S3 or local storage

### Technical Features
- **Mobile-First Design**: Responsive UI optimized for mobile devices
- **Secure**: Password hashing, JWT tokens, input validation
- **Privacy-Focused**: User data protection and privacy controls
- **Scalable**: PostgreSQL database with optimized schema and indexes
- **RESTful API**: Clean and well-documented API endpoints

## 🛠️ Tech Stack

### Frontend
- **React.js**: UI library
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Recharts**: Interactive charts and graphs
- **Vite**: Fast build tool and dev server

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **PostgreSQL**: Relational database
- **JWT**: Authentication tokens
- **bcrypt.js**: Password hashing
- **Multer**: File upload handling
- **AWS SDK**: S3 integration for photo storage

## 📁 Project Structure

```
ricky-gym/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── checkinController.js
│   │   │   ├── friendController.js
│   │   │   └── leaderboardController.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── checkins.js
│   │   │   ├── friends.js
│   │   │   └── leaderboard.js
│   │   ├── utils/
│   │   │   ├── s3.js
│   │   │   └── upload.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── CheckinForm.jsx
│   │   │   ├── CheckinList.jsx
│   │   │   └── StatsCard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Leaderboard.jsx
│   │   │   └── Profile.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── index.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── database/
│   └── schema.sql
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Database Setup

1. Create a PostgreSQL database:
```bash
createdb ricky_gym
```

2. Run the schema:
```bash
psql -d ricky_gym -f database/schema.sql
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ricky_gym
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
```

5. Start the development server:
```bash
npm run dev
```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/signup`
Register a new user.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "johndoe",
  "fullName": "John Doe"
}
```

#### POST `/api/auth/login`
Login an existing user.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET `/api/auth/me`
Get current authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

### User Endpoints

#### GET `/api/users/profile/:userId?`
Get user profile (current user if userId not provided).

#### PUT `/api/users/profile`
Update current user profile.

#### POST `/api/users/profile/photo`
Upload profile photo.

#### GET `/api/users/search?query=<search>`
Search for users.

### Check-in Endpoints

#### POST `/api/checkins`
Create a new check-in.

#### GET `/api/checkins/user/:userId?`
Get user check-ins with optional filters.

**Query Parameters:**
- `startDate`: Filter by start date (YYYY-MM-DD)
- `endDate`: Filter by end date (YYYY-MM-DD)
- `limit`: Number of results (default: 30)
- `offset`: Pagination offset (default: 0)

#### GET `/api/checkins/stats/:userId?`
Get check-in statistics.

**Query Parameters:**
- `period`: Time period (all, year, month, week)

#### DELETE `/api/checkins/:checkinId`
Delete a check-in.

### Friend Endpoints

#### POST `/api/friends/request`
Send a friend request.

#### PUT `/api/friends/request/:friendshipId`
Respond to friend request (accept/reject).

#### GET `/api/friends`
Get friends list.

#### GET `/api/friends/pending`
Get pending friend requests.

#### DELETE `/api/friends/:friendshipId`
Remove a friend.

### Leaderboard Endpoints

#### GET `/api/leaderboard`
Get leaderboard rankings.

**Query Parameters:**
- `period`: Time period (all, year, month, week)
- `friendsOnly`: Filter to friends only (true/false)
- `limit`: Number of results (default: 50)

#### GET `/api/leaderboard/group-stats`
Get group statistics for friends.

## 🔒 Security Features

- **Password Hashing**: Bcrypt with salt rounds of 10
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Express-validator for request validation
- **SQL Injection Protection**: Parameterized queries with pg
- **CORS Protection**: Configured CORS middleware
- **File Upload Limits**: 5MB limit for image uploads
- **Image Type Validation**: Only allows image file types

## 🎨 Design Principles

- **Mobile-First**: Responsive design optimized for mobile devices
- **Accessibility**: Semantic HTML and ARIA labels
- **Performance**: Optimized queries and lazy loading
- **User Experience**: Intuitive interface with clear feedback
- **Scalability**: Efficient database schema with indexes

## 🚀 Deployment

### Backend Deployment

1. Set environment variables on your hosting platform
2. Ensure PostgreSQL database is accessible
3. Run database migrations
4. Deploy backend code
5. Configure AWS S3 (optional) for photo storage

### Frontend Deployment

1. Build the production version:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting platform
3. Configure environment variables for production API URL

### Recommended Hosting Platforms

- **Backend**: Heroku, Railway, Render, AWS Elastic Beanstalk
- **Frontend**: Vercel, Netlify, AWS Amplify
- **Database**: Heroku Postgres, AWS RDS, Supabase

## 🧪 Testing

Currently, the project includes basic error handling and validation. For comprehensive testing:

1. Add Jest for backend unit tests
2. Add React Testing Library for frontend component tests
3. Add Cypress for E2E testing

## 📝 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, please open an issue in the GitHub repository.

---

Built with ❤️ by the Ricky Gym Team