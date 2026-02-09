$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$target = Join-Path $root 'frontend_work'
& (Join-Path $PSScriptRoot 'backup-sync.ps1') -Target $target
