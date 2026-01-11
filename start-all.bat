@echo off
echo ========================================================
echo Starting E-Commerce Microservices Architecture
echo ========================================================

echo Using JAVA_HOME: %JAVA_HOME%

REM Auto-detect JAVA_HOME if missing
if "%JAVA_HOME%"=="" (
    echo Searching for JAVA_HOME in common locations...
    
    REM Check IntelliJ JDKs
    for /d %%i in ("%USERPROFILE%\.jdks\*") do (
        set "JAVA_HOME=%%i"
        goto :FoundJava
    )
    
    REM Check Standard Java
    for /d %%i in ("%ProgramFiles%\Java\jdk*") do (
        set "JAVA_HOME=%%i"
        goto :FoundJava
    )

    REM Check Adoptium/Temurin
    for /d %%i in ("%ProgramFiles%\Eclipse Adoptium\jdk*") do (
        set "JAVA_HOME=%%i"
        goto :FoundJava
    )
)

:FoundJava
if NOT "%JAVA_HOME%"=="" (
    echo Auto-detected JAVA_HOME: %JAVA_HOME%
    set "PATH=%JAVA_HOME%\bin;%PATH%"
) else (
    echo [WARNING] Could not find specific JDK. Relying on system PATH...
)

REM Auto-detect Node.js if missing
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo npm not found in PATH. Searching common locations...
    if exist "%ProgramFiles%\nodejs\npm.cmd" (
        echo Auto-detected Node.js: %ProgramFiles%\nodejs
        set "PATH=%ProgramFiles%\nodejs;%PATH%"
    ) else if exist "%AppData%\npm\npm.cmd" (
         echo Auto-detected Node.js: %AppData%\npm
         set "PATH=%AppData%\npm;%PATH%"
    )
)

timeout /t 3

echo 1. Starting Infrastructure (Docker: Kafka ^& Zookeeper)...
docker-compose up -d
if %errorlevel% neq 0 (
    echo Docker startup failed. Please ensure Docker Desktop is running.
    pause
    exit /b
)
timeout /t 10

echo 2. Starting Discovery Service (8761)...
start "Discovery Service" cmd /c "cd Discovery-service && mvnw.cmd spring-boot:run || pause"
timeout /t 10

echo 3. Starting Config Service (9999)...
start "Config Service" cmd /c "cd config-service && mvnw.cmd spring-boot:run || pause"
timeout /t 10

echo 4. Starting Business Services...
start "Customer Service" cmd /c "cd customer-service && mvnw.cmd spring-boot:run || pause"
start "Inventory Service" cmd /c "cd Inventory-service && mvnw.cmd spring-boot:run || pause"
start "Billing Service" cmd /c "cd Billing-service && mvnw.cmd spring-boot:run || pause"
start "Supplier Service" cmd /c "cd Supplier-service && mvnw.cmd spring-boot:run || pause"
start "Sales Analytics Service" cmd /c "cd Sales-Analytics-service && mvnw.cmd spring-boot:run || pause"

echo 5. Starting Gateway Service (8088)...
timeout /t 15
start "Gateway Service" cmd /c "cd Gateway-service && mvnw.cmd spring-boot:run || pause"

echo 6. Starting Chatbot Service (8090)...
timeout /t 5
start "Chatbot Service" cmd /c "cd Controle-Youssfi-DHISSIAYMAN-CHAT-BOT1-main && ..\Discovery-service\mvnw.cmd spring-boot:run || pause"

echo 7. Starting Angular Frontend (4200)...
timeout /t 5
start "Angular Web App" cmd /c "cd ECOM-WEB-APP && npm install && npm start || pause"

echo ========================================================
echo All services are launching!
echo Please wait a few minutes for everything to initialize.
echo ========================================================
echo API Gateway: http://localhost:8088
echo Chatbot: http://localhost:8090 (Telegram Bot is Active)
pause
