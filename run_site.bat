@echo off
title Zenora Designs - Luxury Interior Showcase
echo ========================================================
echo   ZENORA DESIGNS - LUXURY INTERIOR & 3D WALKTHROUGH
echo   "Rare. Refined. Divine." - Ahmedabad & Rajkot
echo ========================================================
echo.
echo Starting local web server at http://localhost:8082 ...
start http://localhost:8082
echo.
echo Server is active. Keep this window open while testing.
echo Press Ctrl+C to stop the server anytime.
echo ========================================================
echo.
python -m http.server 8082
pause
