@echo off
title Dental Clinic AI Assistant
cd /d "%~dp0"
start "" cmd /c "timeout /t 3 >nul & start "" http://127.0.0.1:3000"
echo Starting Dental Clinic AI Assistant...
echo.
echo Keep this window open while using the website.
echo Website: http://127.0.0.1:3000
echo.
node server.mjs
echo.
echo The server stopped. Press any key to close this window.
pause >nul
