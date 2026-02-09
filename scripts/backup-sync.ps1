param(
  [Parameter(Mandatory = $true)]
  [string]$Target
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot

if (!(Test-Path $Target)) {
  New-Item -ItemType Directory -Path $Target | Out-Null
}

$excludeDirs = @('.git', 'node_modules', 'frontend_work', 'dmtools-frontend-main')
$excludeArgs = @()
foreach ($d in $excludeDirs) { $excludeArgs += '/XD'; $excludeArgs += (Join-Path $root $d) }

# Mirror repo contents into target (excluding backup dirs and .git)
robocopy $root $Target /MIR /FFT /R:1 /W:1 /NFL /NDL /NJH /NJS /NP /XF *.log @excludeArgs | Out-Null
