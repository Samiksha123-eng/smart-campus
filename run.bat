@echo off
title SmartCampus 360 - Campus Operations & Service Platform
color 0B
echo ===============================================================================
echo                SMART CAMPUS SERVICE & OPERATIONS PLATFORM                     
echo                 (Spring Boot 3 + Embedded H2 + Modern SPA)                    
echo ===============================================================================
echo.

set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.20.101-hotspot
set PATH=%JAVA_HOME%\bin;C:\Users\HP\Documents\java\maven\apache-maven-3.9.6\bin;%PATH%

echo [*] Checking Java version...
java -version
if errorlevel 1 (
    echo [ERROR] Java 17 was not detected. Please verify JAVA_HOME.
    pause
    exit /b 1
)

echo.
echo [*] Launching SmartCampus 360 Platform on port 8080...
echo [*] Web Application URL:   http://localhost:8080
echo [*] H2 Database Console:   http://localhost:8080/h2-console
echo.
echo [*] Test Evaluation Accounts (No typing needed - 1-Click Login buttons available in UI):
echo     - Administrator: username=admin,       password=admin123
echo     - Faculty Prof:  username=faculty,     password=faculty123
echo     - Student User:  username=student,     password=student123
echo     - Electrician:   username=staff_elec,  password=staff123
echo     - AV Technician: username=staff_av,    password=staff123
echo ===============================================================================
echo.

if exist "target\smart-campus-platform-1.0.0.jar" (
    java -jar target\smart-campus-platform-1.0.0.jar
) else (
    echo [*] JAR not found. Running via Maven spring-boot:run...
    mvn spring-boot:run
)

pause
