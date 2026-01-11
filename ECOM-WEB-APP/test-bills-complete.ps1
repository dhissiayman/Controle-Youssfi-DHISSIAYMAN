# Script de test complet pour les endpoints Bills
# Teste GET /api/bills et POST /api/bills/generate

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Complet - Endpoints Bills" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$baseUrl = "http://localhost:8088/api/bills"
$headers = @{
    "Content-Type" = "application/json"
    "Accept" = "application/json"
}

# Test 1: GET /api/bills
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "TEST 1: GET /api/bills" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $baseUrl -Method Get -Headers $headers
    
    Write-Host "✅ Succès!" -ForegroundColor Green
    Write-Host "  Type: $($response.GetType().Name)" -ForegroundColor White
    Write-Host "  Est un tableau: $($response -is [Array])" -ForegroundColor White
    
    if ($response -is [Array]) {
        Write-Host "  Nombre de bills: $($response.Count)" -ForegroundColor Cyan
        if ($response.Count -gt 0) {
            Write-Host "  Premier bill ID: $($response[0].id)" -ForegroundColor Gray
        }
    } else {
        Write-Host "  ⚠️  Réponse n'est pas un tableau" -ForegroundColor Yellow
        Write-Host ($response | ConvertTo-Json -Depth 3) -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "  Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    }
}

Write-Host ""

# Test 2: POST /api/bills/generate
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "TEST 2: POST /api/bills/generate" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

try {
    $generateUrl = "$baseUrl/generate"
    $response = Invoke-RestMethod -Uri $generateUrl -Method Post -Headers $headers -Body "{}"
    
    Write-Host "✅ Succès!" -ForegroundColor Green
    Write-Host "  Success: $($response.success)" -ForegroundColor White
    Write-Host "  Bills créés: $($response.billsCreated)" -ForegroundColor Cyan
    Write-Host "  Total bills: $($response.totalBills)" -ForegroundColor Cyan
    Write-Host "  Message: $($response.message)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "  Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    }
}

Write-Host ""

# Test 3: GET /api/bills (après génération)
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "TEST 3: GET /api/bills (après génération)" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

Write-Host "Attente de 1 seconde..." -ForegroundColor Gray
Start-Sleep -Seconds 1

try {
    $response = Invoke-RestMethod -Uri $baseUrl -Method Get -Headers $headers
    
    Write-Host "✅ Succès!" -ForegroundColor Green
    
    if ($response -is [Array]) {
        Write-Host "  Nombre de bills: $($response.Count)" -ForegroundColor Cyan
        
        if ($response.Count -gt 0) {
            Write-Host ""
            Write-Host "  📋 Détails des bills:" -ForegroundColor Yellow
            $response | ForEach-Object -Begin { $i = 1 } -Process {
                Write-Host "    Bill #$i - ID: $($_.id), Customer: $($_.customerId), Items: $($_.productItems.Count)" -ForegroundColor Gray
                $i++
            }
        }
    }
} catch {
    Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Tests terminés!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

