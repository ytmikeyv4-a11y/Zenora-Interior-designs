@echo off
title Zenora Designs - GitHub Uploader
color 0b
echo ================================================================
echo      ZENORA DESIGNS // GITHUB AUTO-UPLOADER & PAGES DEPLOY
echo ================================================================
echo.
echo NOTE: GitHub website par direct drag-and-drop se max 100 files
echo hi upload ho sakti hain.
echo.
echo Hamare project me 1,738 animation frames (total ~159 MB) hain.
echo Yeh script Git command line se saari files ko bina kisi error
echo ke ek hi baar me aapke GitHub account par upload kar dega!
echo.
echo ================================================================
echo STEP 1: Pehle apne browser me https://github.com/new kholein.
echo         - Repository name rakhein (e.g. zenora-luxury-interiors)
echo         - Public select karein.
echo         - "Add README", ".gitignore" SAB UNCHECKED rakhein.
echo         - "Create repository" button dabayein.
echo.
echo STEP 2: Nayi bani hui Repo ka HTTPS link copy karke yahan paste karein.
echo         (Example: https://github.com/username/zenora-luxury-interiors.git)
echo ================================================================
echo.

set /p REPO_URL="GitHub Repository URL paste karein: "

if "%REPO_URL%"=="" (
    echo.
    echo [ERROR] Koi URL enter nahi kiya gaya!
    pause
    exit /b
)

cd /d "C:\Users\Alan Thomas\Desktop\My Projects\Zenora-Luxury-Interiors"

echo.
echo [1/5] Large 159MB upload ke liye Git buffer badha rahe hain...
git config --global http.postBuffer 524288000
git config --global http.maxRequestBuffer 524288000

echo.
echo [2/5] Git repository setup kar rahe hain...
if not exist .git (
    git init -b main
) else (
    git checkout -B main
)

echo.
echo [3/5] Saare 1,738 frames aur files add kar rahe hain (10-20 seconds)...
git add .

echo.
echo [4/5] Commit banaya ja raha hai...
git commit -m "Deploy: Zenora Luxury Interior 3D Walkthrough (1,738 HD Frames)"

echo.
echo [5/5] GitHub par push ho raha hai (internet speed ke hisab se 1-2 min)...
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main
git push -u origin main

echo.
echo ================================================================
if %ERRORLEVEL% EQU 0 (
    echo   [SUCCESS!] Saari files successfully GitHub par upload ho gayi!
    echo.
    echo   AB FREE LIVE SHAREABLE LINK BANANE KE LIYE:
    echo   1. GitHub par apni repo page par jayein.
    echo   2. Upar "Settings" tab par click karein.
    echo   3. Left sidebar me "Pages" par click karein.
    echo   4. "Branch" option me "main" select karein aur "Save" dabayein.
    echo   5. 1-2 minute me aapki live working link ready ho jayegi!
    echo      Aap is link ko WhatsApp par kisi ko bhi bhej sakte hain!
) else (
    echo   [NOTICE] Agar GitHub login popup aaye toh 'Sign in with your browser'
    echo   par click karke login approve karein, fir yeh upload complete ho jayega.
)
echo ================================================================
echo.
pause
