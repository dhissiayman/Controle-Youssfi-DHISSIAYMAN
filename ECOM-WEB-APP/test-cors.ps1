# Script de test CORS pour vérifier la configuration
# Teste si les headers CORS sont correctement retournés

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test CORS - Headers de Réponse" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$url = "http://localhost:8088/api/bills"
$origin = "http://localhost:4200"

Write-Host "Test 1: OPTIONS (Preflight Request)" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri $url `
        -Method Options `
        -Headers @{
            "Origin" = $origin
            "Access-Control-Request-Method" = "GET"
            "Access-Control-Request-Headers" = "Content-Type"
        } `
        -ErrorAction Stop

    Write-Host "✅ Preflight request réussie!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Headers CORS reçus:" -ForegroundColor Cyan
    
    $corsHeaders = @(
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Methods",
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Credentials",
        "Access-Control-Max-Age"
    )
    
    foreach ($header in $corsHeaders) {
        if ($response.Headers[$header]) {
            Write-Host "  ✅ $header : $($response.Headers[$header])" -ForegroundColor Green
        } else {
            Write-Host "  ❌ $header : MANQUANT" -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor White
    
} catch {
    Write-Host "❌ Erreur lors du preflight request" -ForegroundColor Red
    Write-Host "   Message: $($_.Exception.Message)" -ForegroundColor White
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "   Status Code: $statusCode" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "Test 2: GET avec Origin Header" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

try {
    $response = Invoke-WebRequest -Uri $url `
        -Method Get `
        -Headers @{
            "Origin" = $origin
            "Accept" = "application/json"
        } `
        -ErrorAction Stop

    Write-Host "✅ GET request réussie!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Headers CORS dans la réponse:" -ForegroundColor Cyan
    
    if ($response.Headers["Access-Control-Allow-Origin"]) {
        Write-Host "  ✅ Access-Control-Allow-Origin : $($response.Headers['Access-Control-Allow-Origin'])" -ForegroundColor Green
        
        if ($response.Headers["Access-Control-Allow-Origin"] -eq $origin) {
            Write-Host "     ✅ L'origine Angular est autorisée!" -ForegroundColor Green
        } else {
            Write-Host "     ⚠️  L'origine ne correspond pas à $origin" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  ❌ Access-Control-Allow-Origin : MANQUANT" -ForegroundColor Red
        Write-Host "     ⚠️  CORS n'est pas configuré correctement!" -ForegroundColor Red
    }
    
    if ($response.Headers["Access-Control-Allow-Credentials"]) {
        Write-Host "  ✅ Access-Control-Allow-Credentials : $($response.Headers['Access-Control-Allow-Credentials'])" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor White
    Write-Host "Content Length: $($response.Content.Length) bytes" -ForegroundColor White
    
} catch {
    Write-Host "❌ Erreur lors du GET request" -ForegroundColor Red
    Write-Host "   Message: $($_.Exception.Message)" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Résumé" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Si Access-Control-Allow-Origin est MANQUANT:" -ForegroundColor Yellow
Write-Host "  1. Vérifiez que le Gateway Service a été REDÉMARRÉ" -ForegroundColor White
Write-Host "  2. Vérifiez GatewayServiceApplication.java" -ForegroundColor White
Write-Host "  3. Vérifiez les logs du Gateway pour les erreurs" -ForegroundColor White
Write-Host ""

