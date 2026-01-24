:: En contraire mon capitaine
@echo off
setlocal enabledelayedexpansion

@REM small test

:: Set current directory to script location
cd /d "%~dp0"

echo -----------------------------------
echo [0/2] Checking Requirements...
echo -----------------------------------

where git >nul 2>nul
if errorlevel 1 (
    echo ERROR: Git is not installed.
    pause
    exit /b
)
echo Git is installed.

echo.
echo -----------------------------------
echo [1/2] Updating Repository...
echo -----------------------------------

git checkout main
set CHECKOUT_ERROR=%errorlevel%
echo [LOG] git checkout errorlevel: %CHECKOUT_ERROR%

git restore .
set RESTORE_ERROR=%errorlevel%
echo [LOG] git restore errorlevel: %RESTORE_ERROR%

git pull origin main
set PULL_ERROR=%errorlevel%
echo [LOG] git pull errorlevel: %PULL_ERROR%

if %PULL_ERROR% neq 0 (
    echo.
    echo ERROR: Git pull failed with errorlevel: %PULL_ERROR%
    echo [LOG] Git operations failed - checkout: %CHECKOUT_ERROR%, restore: %RESTORE_ERROR%, pull: %PULL_ERROR%
    pause
    exit /b
)

echo.
echo -----------------------------------
echo Managing Old Executables...
echo -----------------------------------

:: Define paths
set "BUILD_DIR=%~dp0build"
set "OLD_DIR=%BUILD_DIR%\old_versions"

if exist "%BUILD_DIR%\*.exe" (
    if not exist "%OLD_DIR%" (
        echo Creating directory: %OLD_DIR%
        mkdir "%OLD_DIR%"
    )

    echo Moving old .exe to old_versions folder...
    move /y "%BUILD_DIR%\*.exe" "%OLD_DIR%\"
) else (
    echo No old .exe found in build folder. Skipping move.
)

echo.
echo -----------------------------------
echo [2/2] Starting better_build.bat...
echo (Auto-answering "n" to config prompt)
echo -----------------------------------

if not exist "better_build.bat" (
    echo ERROR: better_build.bat not found!
    pause
    exit /b
)

(echo n) | call better_build.bat

echo.
echo -----------------------------------
echo Update, Move, and Build process complete!
echo.
pause
