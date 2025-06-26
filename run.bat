@echo off
REM Kill any process using port 3001
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do taskkill /F /PID %%a >nul 2>&1

REM Wait a moment to ensure the port is released
ping 127.0.0.1 -n 3 > nul

REM Start backend in correct directory
start "Backend" cmd /k "cd /d "%~dp0project\backend" && node server.js"

REM Start frontend (Vite or React)
cd project
if exist node_modules (
    echo Frontend dependencies already installed.
) else (
    echo Installing frontend dependencies...
    npm install
)
start "Frontend" cmd /k "npm run dev"
cd ..

REM Wait a few seconds for servers to start
ping 127.0.0.1 -n 6 > nul

REM Open browser to backend (port 3001)
start http://localhost:3001

REM Optionally, open browser to frontend (uncomment if needed)
REM start http://localhost:3000 