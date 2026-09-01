@echo off
title El Palmaret - Servidor Local
cls
echo =========================================
echo   El Palmaret - Servidor Local
echo =========================================
echo.
echo  Iniciando servidor local...
echo.
echo  Web:   http://localhost:8080
echo  Admin: http://localhost:8080/admin.html
echo.
echo  Abriendo navegador automaticamente...
echo  (Manten esta ventana abierta mientras uses la web)
echo.

cd /d "%~dp0"

:: Abre el navegador tras 1.5 segundos cuando el servidor ya este escuchando
start /b cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:8080 & timeout /t 1 /nobreak >nul & start http://localhost:8080/admin.html"

:: Inicia el servidor Python en el puerto 8080
python -m http.server 8080 --bind 0.0.0.0
