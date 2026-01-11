# Script de Test pour les Endpoints Bills
# PowerShell Script pour diagnostiquer les problèmes de connexion

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test des Endpoints Bills" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Gateway répond-il?
Write-Host "Test 1: Vérification du Gateway (port 8088)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8088" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Gateway répond (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Gateway ne répond pas. Vérifiez que le Gateway Service est démarré." -ForegroundColor Red
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Billing Service direct
Write-Host "Test 2: Billing Service direct (port 8083)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8083/bills" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Billing Service répond (Status: $($response.StatusCode))" -ForegroundColor Green
    $content = $response.Content | ConvertFrom-Json
    Write-Host "   Nombre de bills: $($content.Count)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Billing Service ne répond pas. Vérifiez que le Billing Service est démarré." -ForegroundColor Red
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Via Gateway - Liste des bills
Write-Host "Test 3: Via Gateway - Liste des bills (/api/bills)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8088/api/bills" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Endpoint /api/bills fonctionne (Status: $($response.StatusCode))" -ForegroundColor Green
    $content = $response.Content | ConvertFrom-Json
    Write-Host "   Nombre de bills: $($content.Count)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Endpoint /api/bills ne fonctionne pas." -ForegroundColor Red
    Write-Host "   Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Vérifiez:" -ForegroundColor Yellow
    Write-Host "   - Gateway Service est démarré" -ForegroundColor Yellow
    Write-Host "   - Billing Service est démarré et enregistré dans Eureka" -ForegroundColor Yellow
    Write-Host "   - Le nom du service dans application.yml correspond à celui dans Eureka" -ForegroundColor Yellow
}
Write-Host ""

# Test 4: Via Gateway - Générer des bills
Write-Host "Test 4: Via Gateway - Générer des bills (/api/bills/generate)..." -ForegroundColor Yellow
try {
    $headers = @{
        "Content-Type" = "application/json"
    }
    $response = Invoke-WebRequest -Uri "http://localhost:8088/api/bills/generate" -Method POST -Headers $headers -TimeoutSec 10 -ErrorAction Stop
    Write-Host "✅ Endpoint /api/bills/generate fonctionne (Status: $($response.StatusCode))" -ForegroundColor Green
    $content = $response.Content | ConvertFrom-Json
    Write-Host "   Réponse: $($content | ConvertTo-Json)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Endpoint /api/bills/generate ne fonctionne pas." -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "   Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    }
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Vérifiez:" -ForegroundColor Yellow
    Write-Host "   - Gateway Service est démarré" -ForegroundColor Yellow
    Write-Host "   - Billing Service est démarré et enregistré dans Eureka" -ForegroundColor Yellow
    Write-Host "   - Customer Service et Inventory Service sont démarrés" -ForegroundColor Yellow
}
Write-Host ""

# Test 5: Vérifier Eureka
Write-Host "Test 5: Vérification d'Eureka (port 8761)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8761" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Eureka répond (Status: $($response.StatusCode))" -ForegroundColor Green
    Write-Host "   Ouvrez http://localhost:8761 dans votre navigateur pour voir les services enregistrés" -ForegroundColor Gray
} catch {
    Write-Host "❌ Eureka ne répond pas. Vérifiez que le Discovery Service est démarré." -ForegroundColor Red
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Tests terminés" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Si des tests échouent:" -ForegroundColor Yellow
Write-Host "1. Vérifiez Eureka Dashboard: http://localhost:8761" -ForegroundColor Yellow
Write-Host "2. Vérifiez que tous les services sont UP (verts)" -ForegroundColor Yellow
Write-Host "3. Vérifiez le nom exact du Billing Service dans Eureka" -ForegroundColor Yellow
Write-Host "4. Vérifiez que le nom dans Gateway application.yml correspond" -ForegroundColor Yellow
Write-Host "5. Redémarrez le Gateway Service après toute modification" -ForegroundColor Yellow

