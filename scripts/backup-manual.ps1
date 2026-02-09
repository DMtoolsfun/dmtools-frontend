$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$target = Join-Path $root 'dmtools-frontend-main'
& (Join-Path $PSScriptRoot 'backup-sync.ps1') -Target $target
