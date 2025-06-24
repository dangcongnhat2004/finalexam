@echo off
echo Starting Restaurant Management Frontend...
echo.
echo Backend should be running on http://localhost:8080
echo Frontend will open in your default browser
echo.
echo Press any key to open the frontend...
pause > nul
start index.html
echo.
echo Frontend opened! You can now use the restaurant management system.
echo.
echo Note: Make sure the backend is running on http://localhost:8080
echo If you see CORS errors, the backend might not be running.
echo.
pause