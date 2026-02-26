@echo off
REM =========================================
REM build_android_win.bat — Full Android APK build for AI Study Assistant
REM =========================================

:: Step 0 — Load .env
echo ⚡ Loading environment variables...
if not exist ".env" (
    echo ERROR: .env file not found! Exiting.
    pause
    exit /b
)
for /f "usebackq tokens=1,2 delims==" %%A in (".env") do (
    set %%A=%%B
)
echo ✅ Environment loaded.

:: Step 1 — Ensure Node 20
echo ⚡ Switching Node version to 20 via nvm...
nvm install 20
nvm use 20
echo Node version: %NODE_VERSION%

:: Step 2 — Clean project
echo ⚡ Cleaning node_modules and lock files...
rd /s /q node_modules
del /f package-lock.json
del /f pnpm-lock.yaml

:: Step 3 — Fix React / React-DOM for Expo SDK 54
echo ⚡ Installing React / React-DOM compatible with Expo SDK 54...
npx expo install react react-dom

:: Step 4 — Install all dependencies
echo ⚡ Installing all npm dependencies...
npm install

:: Step 5 — Login to EAS
echo ⚡ Logging into EAS CLI...
eas login
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: EAS login failed! Exiting.
    pause
    exit /b
)

:: Step 6 — Start Android cloud build
echo ⚡ Starting Android APK build (preview profile)...
eas build --platform android --profile preview --non-interactive

echo ✅ Build finished. Check the URL in the output to download your APK.
pause