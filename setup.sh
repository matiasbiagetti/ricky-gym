#!/bin/bash

# Ricky Gym Setup Script
# This script helps set up the development environment

set -e

echo "🏋️ Setting up Ricky Gym Development Environment"
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) and try again."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

echo "✅ npm $(npm --version) detected"

# Check for PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed or not in PATH."
    echo "   You'll need to install PostgreSQL manually."
else
    echo "✅ PostgreSQL detected"
fi

echo ""
echo "📦 Installing Backend Dependencies..."
cd backend
npm install
echo "✅ Backend dependencies installed"

echo ""
echo "📦 Installing Frontend Dependencies..."
cd ../frontend
npm install
echo "✅ Frontend dependencies installed"

cd ..

echo ""
echo "⚙️  Setting up environment files..."

# Backend .env
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env from example"
    echo "   ⚠️  Please update backend/.env with your database credentials and JWT secret"
else
    echo "⚠️  backend/.env already exists, skipping..."
fi

# Frontend .env
if [ ! -f frontend/.env ]; then
    cp frontend/.env.example frontend/.env
    echo "✅ Created frontend/.env from example"
else
    echo "⚠️  frontend/.env already exists, skipping..."
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Set up PostgreSQL database:"
echo "   createdb ricky_gym"
echo "   psql -d ricky_gym -f database/schema.sql"
echo ""
echo "2. Update backend/.env with your database credentials"
echo ""
echo "3. Start the backend server:"
echo "   cd backend && npm run dev"
echo ""
echo "4. In a new terminal, start the frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "5. Open http://localhost:3000 in your browser"
echo ""
echo "Happy coding! 💪"
