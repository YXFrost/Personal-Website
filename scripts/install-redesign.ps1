param(
  [Parameter(Mandatory = $true)][string]$RepositoryPath,
  [switch]$Apply
)
$ErrorActionPreference = 'Stop'
$source = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$target = (Resolve-Path $RepositoryPath).Path
if ($source -eq $target -or $source.StartsWith($target + [IO.Path]::DirectorySeparatorChar)) {
  throw 'Extract the download OUTSIDE your existing repository before running this script.'
}
$gitRoot = (& git -C $target rev-parse --show-toplevel 2>$null)
if ($LASTEXITCODE -ne 0 -or [IO.Path]::GetFullPath($gitRoot.Trim()) -ne $target) {
  throw 'RepositoryPath must be the root of your existing Git repository.'
}
$branch = (& git -C $target branch --show-current).Trim()
if (!$branch -or $branch -in @('main', 'master')) {
  throw 'Create and switch to a test branch first: git switch -c website-redesign'
}
$status = & git -C $target status --porcelain
if ($status) { throw 'Save/commit your existing changes first. Run git status and review them.' }
if (!(Test-Path (Join-Path $target 'package.json'))) { throw 'No package.json found.' }
# Stop on configuration variants that would conflict with the supplied .js configs.
foreach ($name in @('next.config.ts','next.config.mjs','next.config.cjs','postcss.config.mjs','postcss.config.cjs','eslint.config.js','eslint.config.cjs','sanity.config.ts','sanity.cli.ts')) {
  if (Test-Path (Join-Path $target $name)) { throw "Unexpected config $name. Ask for a targeted merge; nothing was changed." }
}
$folders = @('app','components','lib','sanity','content','scripts','tests')
$files = @('package.json','package-lock.json','next.config.js','postcss.config.js','jsconfig.json','sanity.config.js','sanity.cli.js','eslint.config.mjs','README.md','START-HERE.md','VERIFICATION.md')
$retired = @('tailwind.config.js','.eslintrc.json','.eslintrc.js','.eslintrc.cjs')
foreach ($item in ($folders + $files)) {
  if (!(Test-Path (Join-Path $source $item))) { throw "Incomplete download: missing $item" }
}
Write-Host "Target: $target"
Write-Host "Branch: $branch"
Write-Host "Replace source folders: $($folders -join ', ')"
Write-Host "Replace root files: $($files -join ', ')"
Write-Host 'Retire old Tailwind/ESLint configs; their settings are now in globals.css / eslint.config.mjs.'
Write-Host 'Merge public assets. Preserve .git, .gitignore, .env files, .vercel and unrelated root files.'
Write-Host 'All replaced source files and public assets will be backed up outside the repository.'
if (!$Apply) {
  Write-Host 'PREVIEW ONLY: nothing changed. Add -Apply after reviewing this plan.'
  exit 0
}
$backupName = (Split-Path $target -Leaf) + '-before-redesign-' + (Get-Date -Format 'yyyyMMdd-HHmmss')
$backup = Join-Path (Split-Path $target -Parent) $backupName
New-Item -ItemType Directory -Path $backup | Out-Null
Write-Host "Backup: $backup"
try {
  foreach ($item in ($folders + $files + $retired)) {
    $destination = Join-Path $target $item
    if (Test-Path $destination) { Move-Item -LiteralPath $destination -Destination (Join-Path $backup $item) }
  }
  if (Test-Path (Join-Path $target 'public')) {
    Copy-Item -LiteralPath (Join-Path $target 'public') -Destination (Join-Path $backup 'public') -Recurse
  }
  foreach ($item in ($folders + $files)) {
    Copy-Item -LiteralPath (Join-Path $source $item) -Destination (Join-Path $target $item) -Recurse
  }
  New-Item -ItemType Directory -Path (Join-Path $target 'public') -Force | Out-Null
  Copy-Item -Path (Join-Path $source 'public/*') -Destination (Join-Path $target 'public') -Recurse -Force
  foreach ($optional in @('.env.local.example','.gitignore')) {
    if (!(Test-Path (Join-Path $target $optional))) {
      Copy-Item -LiteralPath (Join-Path $source $optional) -Destination (Join-Path $target $optional)
    }
  }
} catch {
  Write-Host "Installation stopped. Your original replaced files are in: $backup"
  Write-Host 'Do not commit or deploy the partial result. Restore from that backup or ask for help.'
  throw
}
Write-Host 'Source installed. No Git commit, push, deployment or CMS write was performed.'
Write-Host 'Next: run npm ci, npm run check, and npm run dev inside your repository.'
