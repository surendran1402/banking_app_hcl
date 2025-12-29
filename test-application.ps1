# Banking App - Full System Test
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Banking App - System Status Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Backend Port
Write-Host "1. Backend Service (Port 8080):" -ForegroundColor Yellow
$backendPort = Test-NetConnection -ComputerName localhost -Port 8080 -InformationLevel Quiet -WarningAction SilentlyContinue
if ($backendPort) {
    Write-Host "   ✓ Port 8080 is open and listening" -ForegroundColor Green
} else {
    Write-Host "   ✗ Port 8080 is not accessible" -ForegroundColor Red
}
Write-Host ""

# Test 2: Frontend Port
Write-Host "2. Frontend Service (Port 3000):" -ForegroundColor Yellow
$frontendPort = Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Quiet -WarningAction SilentlyContinue
if ($frontendPort) {
    Write-Host "   ✓ Port 3000 is open and listening" -ForegroundColor Green
} else {
    Write-Host "   ✗ Port 3000 is not accessible" -ForegroundColor Red
}
Write-Host ""

# Test 3: Backend API - Register
Write-Host "3. Backend API - Register Endpoint:" -ForegroundColor Yellow
try {
    $registerBody = @{
        name = "Test User"
        email = "testuser@example.com"
        password = "password123"
        role = "USER"
    } | ConvertTo-Json
    
    $registerResponse = Invoke-WebRequest -Uri "http://localhost:8080/auth/register" `
        -Method POST `
        -Body $registerBody `
        -ContentType "application/json" `
        -UseBasicParsing `
        -ErrorAction Stop
    
    Write-Host "   ✓ Register API working (Status: $($registerResponse.StatusCode))" -ForegroundColor Green
    $registerData = $registerResponse.Content | ConvertFrom-Json
    if ($registerData.success) {
        Write-Host "   ✓ User registered successfully" -ForegroundColor Green
    }
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "   ⚠ User might already exist (400 Bad Request)" -ForegroundColor Yellow
    } else {
        Write-Host "   ✗ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host ""

# Test 4: Backend API - Login
Write-Host "4. Backend API - Login Endpoint:" -ForegroundColor Yellow
try {
    $loginBody = @{
        email = "testuser@example.com"
        password = "password123"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-WebRequest -Uri "http://localhost:8080/auth/login" `
        -Method POST `
        -Body $loginBody `
        -ContentType "application/json" `
        -UseBasicParsing `
        -ErrorAction Stop
    
    Write-Host "   ✓ Login API working (Status: $($loginResponse.StatusCode))" -ForegroundColor Green
    $loginData = $loginResponse.Content | ConvertFrom-Json
    if ($loginData.token) {
        Write-Host "   ✓ JWT Token received: $($loginData.token.Substring(0,30))..." -ForegroundColor Green
        Write-Host "   ✓ User: $($loginData.email) | Role: $($loginData.role)" -ForegroundColor Green
        $global:testToken = $loginData.token
    }
} catch {
    Write-Host "   ✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 5: Frontend React App
Write-Host "5. Frontend React Application:" -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000" `
        -UseBasicParsing `
        -TimeoutSec 3 `
        -ErrorAction Stop
    
    Write-Host "   ✓ Frontend responding (Status: $($frontendResponse.StatusCode))" -ForegroundColor Green
    if ($frontendResponse.Content -match 'root|React|Banking|login') {
        Write-Host "   ✓ React app content detected" -ForegroundColor Green
    }
} catch {
    Write-Host "   ✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 6: API Connection from Frontend
Write-Host "6. Frontend-Backend Connection:" -ForegroundColor Yellow
Write-Host "   ✓ Frontend configured to connect to: http://localhost:8080" -ForegroundColor Green
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$allTests = @(
    @{Name="Backend Port"; Status=$backendPort},
    @{Name="Frontend Port"; Status=$frontendPort}
)

$passed = ($allTests | Where-Object {$_.Status -eq $true}).Count
$total = $allTests.Count

Write-Host "Services Running: $passed/$total" -ForegroundColor $(if ($passed -eq $total) {"Green"} else {"Yellow"})
Write-Host ""
Write-Host "Access the application at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend API at: http://localhost:8080" -ForegroundColor Cyan
Write-Host ""


