# Populate Data for E-Commerce App

$baseUrl = "http://localhost:8088/api"

Write-Host "Creating Suppliers..." -ForegroundColor Cyan
$suppliers = @(
    @{name="Lenovo"; email="contact@lenovo.com"},
    @{name="HP"    ; email="sales@hp.com"},
    @{name="Dell"  ; email="info@dell.com"}
)

foreach ($s in $suppliers) {
    try {
        $body = $s | ConvertTo-Json
        Invoke-RestMethod -Method Post -Uri "$baseUrl/suppliers" -ContentType "application/json" -Body $body
        Write-Host " + Created Supplier: $($s.name)" -ForegroundColor Green
    } catch {
        Write-Host " ! Failed to create $($s.name)" -ForegroundColor Red
    }
}

Write-Host "`nCreating Bills..." -ForegroundColor Cyan
# Create bills for customer 1
for ($i=1; $i -le 5; $i++) {
    try {
        $body = @{
            customerId = 1
            billingDate = Get-Date -Format "yyyy-MM-dd"
            productItems = @() # Empty items for now, logic handles total calc
        } | ConvertTo-Json
        
        Invoke-RestMethod -Method Post -Uri "$baseUrl/bills" -ContentType "application/json" -Body $body
        Write-Host " + Created Bill #$i" -ForegroundColor Green
    } catch {
        Write-Host " ! Failed to create Bill #$i" -ForegroundColor Red
    }
}

Write-Host "`nDONE! Go refresh your Analytics Dashboard." -ForegroundColor Yellow
