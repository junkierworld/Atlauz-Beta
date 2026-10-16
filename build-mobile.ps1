# ATLAUZ Mobile Build Script for Windows
# Builds APK for Android deployment

param(
    [switch]$Debug,
    [switch]$Release,
    [switch]$Clean,
    [switch]$Install
)

$ErrorActionPreference = "Stop"

function Write-Success { Write-Host "✅ $args" -ForegroundColor Green }
function Write-Error { Write-Host "❌ $args" -ForegroundColor Red }
function Write-Info { Write-Host "ℹ️  $args" -ForegroundColor Cyan }

Write-Info "ATLAUZ Mobile Build Script"
Write-Info "============================"

# Check Android SDK
if (-not $env:ANDROID_HOME) {
    Write-Error "ANDROID_HOME environment variable not set"
    Write-Info "Set it to your Android SDK path (e.g., C:\Android\sdk)"
    exit 1
}

Write-Success "Android SDK found: $env:ANDROID_HOME"

# Step 1: Clean (optional)
if ($Clean) {
    Write-Info "Cleaning build artifacts..."
    Remove-Item -Force -Recurse "dist" -ErrorAction SilentlyContinue
    Remove-Item -Force -Recurse "android/app/build" -ErrorAction SilentlyContinue
    Write-Success "Cleaned"
}

# Step 2: Web build
Write-Info "Building web assets..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Web build failed"
    exit 1
}
Write-Success "Web build complete"

# Step 3: Sync Capacitor
Write-Info "Syncing Capacitor files..."
npx cap sync android
if ($LASTEXITCODE -ne 0) {
    Write-Error "Capacitor sync failed"
    exit 1
}
Write-Success "Capacitor sync complete"

# Step 4: Build APK
Write-Info "Building APK..."
Push-Location "android"

if ($Release) {
    Write-Info "Building release APK..."
    .\gradlew.bat assembleRelease
    $apkPath = "app/build/outputs/apk/release/app-release.apk"
} else {
    Write-Info "Building debug APK..."
    .\gradlew.bat assembleDebug
    $apkPath = "app/build/outputs/apk/debug/app-debug.apk"
}

if ($LASTEXITCODE -ne 0) {
    Pop-Location
    Write-Error "APK build failed"
    exit 1
}

Pop-Location
Write-Success "APK built successfully: $apkPath"

# Step 5: Install (optional)
if ($Install) {
    Write-Info "Looking for connected devices..."
    $devices = & adb devices | Select-Object -Skip 1 | Where-Object { $_ -match '\tdevice$' }
    
    if ($devices.Count -eq 0) {
        Write-Error "No connected devices found"
        exit 1
    }
    
    Write-Success "Found connected device(s)"
    Write-Info "Installing APK..."
    adb install -r "$apkPath"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "APK installed successfully"
        Write-Info "Launching app..."
        adb shell am start -n com.atlauz.beta/com.atlauz.beta.MainActivity
    } else {
        Write-Error "Installation failed"
        exit 1
    }
}

Write-Success "Build complete!"
Write-Info "APK location: $apkPath"
Write-Info ""
Write-Info "Next steps:"
Write-Info "  - Test on device: adb install -r $apkPath"
Write-Info "  - View logs: adb logcat"
Write-Info "  - For release: Use release APK for Play Store"
