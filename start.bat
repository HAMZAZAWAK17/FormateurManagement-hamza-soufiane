@echo off
echo ========================================
echo   Application Gestion de Formation
echo ========================================
echo.

echo [1/3] Verification de MySQL...
echo Assurez-vous que MySQL est demarre !
echo.
pause

echo.
echo [2/3] Demarrage du Backend...
echo.
start cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > nul

echo.
echo [3/3] Demarrage du Frontend...
echo.
start cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Serveurs demarres !
echo ========================================
echo.
echo Backend : http://localhost:5000
echo Frontend : http://localhost:5173
echo.
echo Appuyez sur une touche pour fermer cette fenetre...
pause > nul
