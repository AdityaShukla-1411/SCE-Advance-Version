#!/bin/bash

# SCE Advanced - Development Startup Script

echo "🚀 Starting SCE Advanced Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are available"

# Start backend in background
echo "🔧 Starting backend server..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Copy environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your configuration"
fi

# Start backend
npm run dev &
BACKEND_PID=$!
echo "✅ Backend started on http://localhost:5000 (PID: $BACKEND_PID)"

# Start frontend
echo "🎨 Starting frontend..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start frontend
npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend started on http://localhost:3000 (PID: $FRONTEND_PID)"

echo ""
echo "🎉 SCE Advanced is now running!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:5000"
echo "📊 Health:   http://localhost:5000/api/health"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
trap "echo '🛑 Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM

wait
