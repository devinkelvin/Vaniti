$ErrorActionPreference = "Stop"

$JAVA_HOME = "C:\Program Files\Android\openjdk\jdk-21.0.8"
$env:JAVA_HOME = $JAVA_HOME
$env:PATH = "$JAVA_HOME\bin;$env:PATH"

$AAPT = "C:\Program Files (x86)\Android\android-sdk\build-tools\36.0.0\aapt.exe"
$D8 = "C:\Program Files (x86)\Android\android-sdk\build-tools\36.0.0\d8.bat"
$ZIPALIGN = "C:\Program Files (x86)\Android\android-sdk\build-tools\36.0.0\zipalign.exe"
$APKSIGNER = "C:\Program Files (x86)\Android\android-sdk\build-tools\36.0.0\apksigner.bat"
$ANDROID_JAR = "C:\Program Files (x86)\Android\android-sdk\platforms\android-35\android.jar"
$ADB = "C:\Program Files (x86)\Android\android-sdk\platform-tools\adb.exe"
$KEYTOOL = "$JAVA_HOME\bin\keytool.exe"
$JAVAC = "$JAVA_HOME\bin\javac.exe"

$BaseDir = "c:\Users\Kelvin Ekuhoho\Desktop\Zengly\android-app"
Set-Location $BaseDir

Write-Host "1. Creating build folders..."
New-Item -ItemType Directory -Force -Path "gen", "bin", "bin\classes", "assets" | Out-Null

Write-Host "2. Copying web build to assets..."
if (Test-Path "..\dist") {
    Copy-Item -Path "..\dist" -Destination "assets\dist" -Recurse -Force
}

Write-Host "3. Generating R.java with AAPT..."
& $AAPT package -f -m -J "gen" -M "AndroidManifest.xml" -S "res" -I $ANDROID_JAR

Write-Host "4. Compiling Java source with javac..."
$javaFiles = Get-ChildItem -Path "gen", "src" -Filter "*.java" -Recurse | Select-Object -ExpandProperty FullName
& $JAVAC -d "bin\classes" -cp $ANDROID_JAR $javaFiles

Write-Host "5. Converting bytecode to classes.dex with D8..."
$classFiles = Get-ChildItem -Path "bin\classes" -Filter "*.class" -Recurse | Select-Object -ExpandProperty FullName
& $D8 --output "bin" $classFiles

Write-Host "6. Packaging resources and assets into unaligned APK..."
& $AAPT package -f -M "AndroidManifest.xml" -S "res" -A "assets" -I $ANDROID_JAR -F "bin\unaligned.apk"

Write-Host "7. Adding classes.dex to APK..."
Push-Location "bin"
& $AAPT add "unaligned.apk" "classes.dex"
Pop-Location

Write-Host "8. Checking debug keystore..."
if (-not (Test-Path "debug.keystore")) {
    & $KEYTOOL -genkey -v -keystore "debug.keystore" -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"
}

Write-Host "9. Zipaligning APK..."
& $ZIPALIGN -f -p 4 "bin\unaligned.apk" "bin\vaniti-aligned.apk"

Write-Host "10. Signing APK with apksigner..."
& $APKSIGNER sign --ks "debug.keystore" --ks-pass pass:android --key-pass pass:android --out "bin\vaniti.apk" "bin\vaniti-aligned.apk"

Write-Host "11. Verifying APK signature..."
& $APKSIGNER verify "bin\vaniti.apk"

Write-Host "12. Setting ADB reverse port 5173..."
& $ADB reverse tcp:5173 tcp:5173

Write-Host "13. Installing Vaniti APK on connected device..."
& $ADB install -r "bin\vaniti.apk"

Write-Host "14. Launching Vaniti on phone..."
& $ADB shell am start -n com.vaniti.app/.MainActivity

Write-Host "SUCCESS! Vaniti mobile app is installed and running on Kelvin's Galaxy S10!"
