# Test Cabinet Backend Endpoints
Write-Host "Testing Cabinet Backend Endpoints..." -ForegroundColor Green

$baseUrl = "http://localhost:3001/api/cabinet"

# Test 1: Get Material Types
Write-Host "`n1. Testing GET /material-types" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/material-types" -Method GET
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Get Material Thicknesses
Write-Host "`n2. Testing GET /material-thicknesses" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/material-thicknesses" -Method GET
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Get Edge Thicknesses
Write-Host "`n3. Testing GET /edge-thicknesses" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/edge-thicknesses" -Method GET
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Get Part Types
Write-Host "`n4. Testing GET /part-types" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/part-types" -Method GET
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Get Accessories
Write-Host "`n5. Testing GET /accessories" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/accessories" -Method GET
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Get Cabinet Parts
Write-Host "`n6. Testing GET /parts" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/parts" -Method GET
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nEndpoint testing completed!" -ForegroundColor Green 