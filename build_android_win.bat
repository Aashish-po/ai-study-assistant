@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

echo Step 1: Installing dependencies...
npm install

echo Step 2: Ensuring dotenv is installed...
npm list dotenv >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
  echo Installing dotenv...
  npm install dotenv
)

echo Step 3: Loading .env variables...
IF EXIST .env (
  echo .env file found.
) ELSE (
  echo ERROR: .env file not found!
  EXIT /B 1
)

echo Step 4: Starting Metro bundler...
start cmd /k "npx expo start"

echo Step 5: Running app on Android emulator...
npx expo run:android

ENDLOCAL