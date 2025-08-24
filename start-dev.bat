@echo off
REM SCE Advanced - Development Startup Script for Windows

echo 🚀 Starting SCE Advanced Development Environment...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are available

REM Start backend
echo 🔧 Starting backend server...
cd backend

if not exist "node_modules" (
    echo 📦 Installing backend dependencies...
    call npm install
)

REM Copy environment file if it doesn't exist
if not exist ".env" (
    echo 📝 Creating environment file...
    copy ".env.example" ".env"
    echo ⚠️  Please edit backend/.env with your configuration
)

REM Start backend in background
echo ✅ Starting backend on http://localhost:5000
start "SCE Backend" cmd /c "npm run dev"

REM Start frontend
echo 🎨 Starting frontend...
cd ..\frontend

if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    call npm install
)

REM Start frontend
echo ✅ Starting frontend on http://localhost:3000
start "SCE Frontend" cmd /c "npm run dev"

echo.
echo 🎉 SCE Advanced is now running!
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend:  http://localhost:5000
echo 📊 Health:   http://localhost:5000/api/health
echo.
echo Press any key to continue...
pause >nul
