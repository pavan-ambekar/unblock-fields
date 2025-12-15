<#
PowerShell helper to create a ZIP of the extension and (optionally) pack a .crx using Chrome.

Usage examples:
  # Create a ZIP release one folder up
  .\pack-extension.ps1 -OutZip "..\unblock-fields-v0.0.1.zip"

  # Create ZIP and attempt to pack with Chrome (requires Chrome installed and path provided)
  .\pack-extension.ps1 -OutZip "..\unblock-fields-v0.0.1.zip" -ChromePath "C:\Program Files\Google\Chrome\Application\chrome.exe"

Notes:
- Packing with Chrome produces a .crx and a private key .pem when you pass --pack-extension-key.
- Modern Chrome will not allow direct install of .crx files on some systems; prefer uploading the ZIP to GitHub releases and instruct users to enable Developer Mode and "Load unpacked" for testing.
#>

param(
    [string]$OutZip = "..\unblock-fields.zip",
    [string]$ChromePath = $null,
    [string]$KeyPath = $null
)

$cwd = Split-Path -Path $MyInvocation.MyCommand.Path -Parent
Write-Host "Creating ZIP from: $cwd -> $OutZip"

if (Test-Path $OutZip) { Remove-Item $OutZip -Force }

# Use Compress-Archive; exclude common artifacts
$items = Get-ChildItem -Path $cwd -Force | Where-Object { $_.Name -ne '.git' -and $_.Name -ne $OutZip }

Compress-Archive -Path $items.FullName -DestinationPath $OutZip -Force
Write-Host "ZIP created: $OutZip"

if ($ChromePath) {
    if (-not (Test-Path $ChromePath)) { Write-Error "Chrome not found at $ChromePath"; exit 1 }

    # If a key path is not provided, Chrome will create one and output it next to the CRX
    $packCmd = "`"$ChromePath`" --pack-extension=`"$cwd`""
    if ($KeyPath) { $packCmd += " --pack-extension-key=`"$KeyPath`"" }

    Write-Host "Running: $packCmd"
    Invoke-Expression $packCmd
    Write-Host "If packing succeeded, a .crx and a .pem key will be created alongside the extension folder."
}
