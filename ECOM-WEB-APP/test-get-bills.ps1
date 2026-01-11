# Script de test pour GET /api/bills
# Teste si l'endpoint retourne des bills

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test GET /api/bills" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$url = "http://localhost:8088/api/bills"

Write-Host "URL: $url" -ForegroundColor Yellow
Write-Host ""

try {
    Write-Host "Envoi de la requête GET..." -ForegroundColor Green
    
    $response = Invoke-RestMethod -Uri $url -Method Get -ContentType "application/json" -Headers @{
        "Accept" = "application/json"
    }
    
    Write-Host "✅ Succès! Réponse reçue." -ForegroundColor Green
    Write-Host ""
    Write-Host "Type de réponse:" -ForegroundColor Yellow
    Write-Host "  - Type: $($response.GetType().Name)" -ForegroundColor White
    Write-Host "  - Est un tableau? $($response -is [Array])" -ForegroundColor White
    Write-Host ""
    
    if ($response -is [Array]) {
        Write-Host "Nombre de bills: $($response.Count)" -ForegroundColor Cyan
        Write-Host ""
        
        if ($response.Count -eq 0) {
            Write-Host "⚠️  Aucun bill trouvé (tableau vide)" -ForegroundColor Yellow
            Write-Host "   Cela signifie que l'endpoint fonctionne mais qu'il n'y a pas de bills." -ForegroundColor Gray
            Write-Host "   Utilisez POST /api/bills/generate pour créer des bills." -ForegroundColor Gray
        } else {
            Write-Host "📋 Détails des bills:" -ForegroundColor Cyan
            Write-Host ""
            
            $response | ForEach-Object -Begin { $index = 1 } -Process {
                Write-Host "  Bill #$index:" -ForegroundColor White
                Write-Host "    - ID: $($_.id)" -ForegroundColor Gray
                Write-Host "    - Customer ID: $($_.customerId)" -ForegroundColor Gray
                Write-Host "    - Billing Date: $($_.billingDate)" -ForegroundColor Gray
                Write-Host "    - Product Items: $($_.productItems.Count)" -ForegroundColor Gray
                if ($_.customer) {
                    Write-Host "    - Customer: $($_.customer.name) ($($_.customer.email))" -ForegroundColor Gray
                }
                Write-Host ""
                $index++
            }
        }
    } else {
        Write-Host "⚠️  La réponse n'est pas un tableau" -ForegroundColor Yellow
        Write-Host "   Contenu de la réponse:" -ForegroundColor Gray
        Write-Host ($response | ConvertTo-Json -Depth 10) -ForegroundColor White
    }
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "✅ Test réussi!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Erreur lors de la requête!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Détails de l'erreur:" -ForegroundColor Yellow
    Write-Host "  - Message: $($_.Exception.Message)" -ForegroundColor White
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "  - Status Code: $statusCode" -ForegroundColor White
        
        try {
            $errorStream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorStream)
            $responseBody = $reader.ReadToEnd()
            Write-Host "  - Response Body:" -ForegroundColor White
            Write-Host $responseBody -ForegroundColor Gray
        } catch {
            Write-Host "  - Impossible de lire le corps de la réponse" -ForegroundColor Gray
        }
    }
    
    Write-Host ""
    Write-Host "Vérifications:" -ForegroundColor Yellow
    Write-Host "  1. Gateway Service est démarré (port 8088)" -ForegroundColor Gray
    Write-Host "  2. Billing Service est démarré (port 8083)" -ForegroundColor Gray
    Write-Host "  3. Services sont enregistrés dans Eureka (port 8761)" -ForegroundColor Gray
    Write-Host "  4. Route /api/bills est configurée dans Gateway" -ForegroundColor Gray
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "❌ Test échoué!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Pour tester avec curl (si disponible):" -ForegroundColor Cyan
Write-Host "  curl http://localhost:8088/api/bills" -ForegroundColor White
Write-Host ""

