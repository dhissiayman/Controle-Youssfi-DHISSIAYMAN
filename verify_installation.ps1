# Verification Script for Event-Driven Architecture
Write-Host "Waiting for Gateway to start (polling http://localhost:8088)..." -ForegroundColor Cyan

$retries = 150
while ($retries -gt 0) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8088/actuator/health" -Method Head -UseBasicParsing -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Gateway is UP!" -ForegroundColor Green
            break
        }
    } catch {
        Write-Host "." -NoNewline
        Start-Sleep -Seconds 2
        $retries--
    }
}

if ($retries -eq 0) {
    Write-Host "❌ Gateway failed to start. Please run start-all.bat first." -ForegroundColor Red
    exit 1
}

Write-Host "`n1. Creating a Test Supplier..." -ForegroundColor Yellow
try {
    $supplierBody = @{
        name = "AutoTest Supplier"
        email = "autotest@supplier.com"
    } | ConvertTo-Json

    Invoke-RestMethod -Method Post -Uri "http://localhost:8088/api/suppliers" -ContentType "application/json" -Body $supplierBody
    Write-Host "✅ Supplier Created." -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create supplier: $_" -ForegroundColor Red
}

Write-Host "`n2. Creating a Test Bill..." -ForegroundColor Yellow
try {
    $billBody = @{
        customerId = 1
        billingDate = "2024-01-01"
    } | ConvertTo-Json

    Invoke-RestMethod -Method Post -Uri "http://localhost:8088/api/bills" -ContentType "application/json" -Body $billBody
    Write-Host "✅ Bill Created." -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create bill: $_" -ForegroundColor Red
}

Write-Host "`n3. Verifying Analytics (Waiting 5s for Kafka)..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

try {
    $analytics = Invoke-RestMethod -Uri "http://localhost:8088/api/analytics"
    Write-Host "Current Analytics Data:" -ForegroundColor Cyan
    $analytics | Format-List

    if ($analytics."Total Suppliers" -ge 1 -and $analytics."Total Bills" -ge 1) {
        Write-Host "✅ SUCCESS: Analytics received events from Kafka!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ WARNING: Analytics counts look low. Check Kafka logs." -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Failed to get analytics: $_" -ForegroundColor Red
}

Write-Host "`n4. Front-End Check" -ForegroundColor Yellow
Write-Host "Please open http://localhost:4200/analytics in your browser."
Write-Host "Login to Telegram and chat with MyDHISSIAiAgentBot to test the Chatbot."
