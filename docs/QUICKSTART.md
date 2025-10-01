# Quick Start Guide - Ricky Gym

This guide will help you get Ricky Gym up and running on your local machine in just a few minutes.

## Prerequisites

Before starting, make sure you have:
- Node.js (v16 or higher) - [Download](https://nodejs.org/)
- PostgreSQL (v12 or higher) - [Download](https://www.postgresql.org/download/)
- npm (comes with Node.js)

## Quick Setup (Automated)

Run the setup script to automatically install dependencies and create environment files:

```bash
./setup.sh
```

## Manual Setup

If you prefer to set up manually or the script doesn't work, follow these steps:

### 1. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Set Up Database

```bash
# Create database
createdb ricky_gym

# Run schema
psql -d ricky_gym -f database/schema.sql
```

### 3. Configure Environment

**Backend (.env):**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and update these values:
```env
DB_NAME=ricky_gym
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_random_secret_key_here
```

**Frontend (.env):**
```bash
cd frontend
cp .env.example .env
```

The default values should work for local development.

### 4. Start the Application

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

The backend will start on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The frontend will start on http://localhost:3000

### 5. Create Your First Account

1. Open http://localhost:3000 in your browser
2. Click "Sign up" 
3. Fill in your details
4. Start tracking your gym attendance!

## Troubleshooting

### Database Connection Issues

If you see database connection errors:
1. Make sure PostgreSQL is running: `pg_ctl status`
2. Check your credentials in `backend/.env`
3. Ensure the database exists: `psql -l | grep ricky_gym`

### Port Already in Use

If port 5000 or 3000 is already in use:
- Change `PORT` in `backend/.env`
- Change `server.port` in `frontend/vite.config.js`

### Module Not Found Errors

Run `npm install` again in the respective directory (backend or frontend).

### Build Errors

Make sure you're using Node.js v16 or higher:
```bash
node --version
```

## Next Steps

Once your app is running:
- Create your profile
- Make your first check-in
- Invite friends by sharing their username
- Check out the leaderboard
- View your statistics and graphs

## Production Deployment

See the main [README.md](README.md) for detailed deployment instructions.

## Support

If you encounter issues:
1. Check the [README.md](README.md) for detailed documentation
2. Review the troubleshooting section above
3. Open an issue on GitHub

Happy tracking! 💪🏋️
