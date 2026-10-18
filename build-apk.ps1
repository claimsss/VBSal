# Сборка VBsal.apk для Android.
# Запуск: правый клик → «Выполнить с помощью PowerShell», или в терминале: .\build-apk.ps1
# Не 'Stop': gradle пишет предупреждения в stderr, ошибки ловим по коду возврата
$ErrorActionPreference = 'Continue'
Set-Location $PSScriptRoot

$env:JAVA_HOME = 'D:\VBSal-tools\jdk21'
$env:ANDROID_HOME = 'D:\VBSal-tools\sdk'
$env:Path = "$env:JAVA_HOME\bin;" + [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [Environment]::GetEnvironmentVariable('Path', 'User')

npx.cmd cap sync android
if ($LASTEXITCODE -ne 0) { throw 'cap sync завершился с ошибкой' }

Push-Location android
try {
  .\gradlew.bat assembleRelease --console=plain
  if ($LASTEXITCODE -ne 0) { throw 'Сборка Gradle завершилась с ошибкой' }
} finally {
  Pop-Location
}

Copy-Item 'android\app\build\outputs\apk\release\app-release.apk' 'VBsal.apk' -Force
Write-Host "Готово: $PSScriptRoot\VBsal.apk"
