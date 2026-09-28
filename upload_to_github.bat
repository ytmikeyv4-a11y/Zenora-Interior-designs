@echo off
title Zenora Designs - Uploading to GitHub
color 0a
echo ================================================================
echo    ZENORA DESIGNS // UPLOADING TO GITHUB
echo    Repo: https://github.com/ytmikeyv4-a11y/Zenora-Interior-designs
echo ================================================================
echo.
echo Saari 1,738 files (159 MB) upload ho rahi hain...
echo (Agar pehli baar browser me login popup aaye toh "Sign in with browser" dabayein)
echo.
cd /d "%~dp0"
git config http.postBuffer 524288000
git push -u origin main
echo.
echo ================================================================
if %ERRORLEVEL% EQU 0 (
    echo   [SUCCESS!] Saari files successfully upload ho gayi hain!
    echo.
    echo   AB FREE LIVE LINK BANANE KE LIYE:
    echo   1. Is link par jayein:
    echo      https://github.com/ytmikeyv4-a11y/Zenora-Interior-designs/settings/pages
    echo   2. "Branch" ke dropdown me "main" select karein aur "Save" dabayein.
    echo   3. 1 minute me aapki live working link ready ho jayegi:
    echo      https://ytmikeyv4-a11y.github.io/Zenora-Interior-designs/
) else (
    echo   [ERROR] Upload me koi dikkat aayi.
)
echo ================================================================
echo.
pause
