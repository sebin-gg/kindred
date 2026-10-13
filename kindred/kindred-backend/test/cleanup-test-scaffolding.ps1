# test-cleanup.ps1
$debugFiles = @(
    'auth.middleware.test.js',
    'check-auth-tests.cjs',
    'fix-space.cjs',
    'fix-space2.cjs',
    'hang-debug.cjs',
    'hang-debug.mjs',
    'hang-debug.out',
    'inspect-line.cjs',
    'minimal-replace-test.cjs',
    'patch-auth-tests.cjs',
    'run-with-timeout.ps1',
    'test-err.log',
    'test-out.log',
    'timeout-debug.cjs'
)
$debugDirs = @('min-repro')
foreach ($f in $debugFiles) {
    $path = Join-Path $PSScriptRoot $f
    if (Test-Path $path) { Remove-Item -Force $path -ErrorAction SilentlyContinue }
}
foreach ($d in $debugDirs) {
    $path = Join-Path $PSScriptRoot $d
    if (Test-Path $path -PathType Container) { Remove-Item -Force -Recurse $path -ErrorAction SilentlyContinue }
}
Write-Host 'cleaned'