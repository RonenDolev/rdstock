@echo off
cd /d C:\dstock
call npm install
<<<<<<< HEAD

REM פותח את הדפדפן אחרי 3 שניות, במקביל
start "" cmd /c "timeout /t 3 >nul && start http://localhost:3000"

call npm run dev
pause
=======
call npm run dev
>>>>>>> dc28f1abb29b615d210c0adac97795d3ccef9f63
