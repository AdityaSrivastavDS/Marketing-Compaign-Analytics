param(
    [string]$baseDir = (Join-Path (Split-Path -Parent $PSScriptRoot) "powerbi")
)

$projName = "SOLVENNE_Marketing_Intelligence_Dashboard"

$reportDir = Join-Path $baseDir "$projName.Report"
$modelDir = Join-Path $baseDir "$projName.SemanticModel"
$modelBimPath = Join-Path $modelDir "model.bim"
$themePath = Join-Path $reportDir "StaticResources\SharedResources\BaseThemes\SolvenneTheme.json"

# Support both monolithic report.json and definition\report.json
$reportJsonPath = Join-Path $reportDir "report.json"
if (-not (Test-Path $reportJsonPath)) {
    $reportJsonPath = Join-Path $reportDir "definition\report.json"
}

if (-not (Test-Path $reportJsonPath)) {
    Write-Warning "report.json not found at $reportJsonPath. Generating from pages if available or skipping."
}

$reportJson = if (Test-Path $reportJsonPath) { Get-Content $reportJsonPath -Raw -Encoding UTF8 } else { "{}" }
$modelBim = Get-Content $modelBimPath -Raw -Encoding UTF8
$theme = if (Test-Path $themePath) { Get-Content $themePath -Raw -Encoding UTF8 } else { "{}" }

$utf16NoBom = New-Object System.Text.UnicodeEncoding($false, $false)
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

Add-Type -AssemblyName System.IO.Compression.FileSystem

# 1. BUILD PBIT
$pbitPkg = Join-Path $baseDir "pkg_pbit"
if (Test-Path $pbitPkg) { Remove-Item $pbitPkg -Recurse -Force }
New-Item -ItemType Directory -Path "$pbitPkg\Report\StaticResources\SharedResources\BaseThemes" -Force | Out-Null

[System.IO.File]::WriteAllText("$pbitPkg\Version", "1.25`n", $utf8NoBom)
[System.IO.File]::WriteAllText("$pbitPkg\DataModelSchema", $modelBim, $utf16NoBom)
[System.IO.File]::WriteAllText("$pbitPkg\Report\Layout", $reportJson, $utf16NoBom)
[System.IO.File]::WriteAllText("$pbitPkg\Report\StaticResources\SharedResources\BaseThemes\SolvenneTheme.json", $theme, $utf8NoBom)

$settingsJson = '{"Version":1,"ReportSettings":{},"QueriesSettings":{"TypeDetectionEnabled":true,"RelationshipImportEnabled":true,"RunBackgroundAnalysis":true,"Version":"2.81.5831.821"}}'
[System.IO.File]::WriteAllText("$pbitPkg\Settings", $settingsJson, $utf16NoBom)

$metadataJson = '{"Version":5,"AutoCreatedRelationships":[],"FileDescription":"SOLVENNE Marketing Intelligence & Customer Analytics Dashboard","CreatedFrom":"Desktop","CreatedFromRelease":"2024.02"}'
[System.IO.File]::WriteAllText("$pbitPkg\Metadata", $metadataJson, $utf16NoBom)

$diagramJson = '{"version":"1.1.0","diagrams":[{"ordinal":0,"scrollPosition":{"x":0,"y":0},"nodes":[{"location":{"x":100,"y":100},"nodeType":"Table","nodeTitle":"Customer","nodeId":"Customer","size":{"width":250,"height":500},"zIndex":0}],"zoomValue":100,"pinKeyFieldsToTop":false,"showExtraHeaderInfo":false,"hideKeyFieldsWhenCollapsed":false,"tablesExpanded":true}]}'
[System.IO.File]::WriteAllText("$pbitPkg\DiagramLayout", $diagramJson, $utf16NoBom)

$contentTypes = '<?xml version="1.0" encoding="utf-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="txt" ContentType="text/plain" /><Default Extension="xml" ContentType="text/xml" /><Default Extension="json" ContentType="application/json" /><Override PartName="/Version" ContentType="application/octet-stream" /><Override PartName="/Settings" ContentType="application/octet-stream" /><Override PartName="/Metadata" ContentType="application/octet-stream" /><Override PartName="/DiagramLayout" ContentType="application/octet-stream" /><Override PartName="/DataModelSchema" ContentType="application/octet-stream" /><Override PartName="/Report/Layout" ContentType="application/octet-stream" /><Override PartName="/Report/StaticResources/SharedResources/BaseThemes/SolvenneTheme.json" ContentType="application/json" /></Types>'
[System.IO.File]::WriteAllText("$pbitPkg\[Content_Types].xml", $contentTypes, $utf8NoBom)

$pbitOut = Join-Path $baseDir "$projName.pbit"
if (Test-Path $pbitOut) { Remove-Item $pbitOut -Force }
[System.IO.Compression.ZipFile]::CreateFromDirectory($pbitPkg, $pbitOut)
Write-Output "Created PBIT: $pbitOut (Size: $((Get-Item $pbitOut).Length) bytes)"
Remove-Item $pbitPkg -Recurse -Force

# 2. BUILD PBIX (if existing pbix exists to re-package)
$pbixOut = Join-Path $baseDir "$projName.pbix"
if (Test-Path $pbixOut) {
    $pbixBackup = Join-Path $baseDir "$projName.bak.pbix"
    Copy-Item $pbixOut $pbixBackup -Force

    $pbixPkg = Join-Path $baseDir "pkg_pbix"
    if (Test-Path $pbixPkg) { Remove-Item $pbixPkg -Recurse -Force }
    New-Item -ItemType Directory -Path $pbixPkg -Force | Out-Null

    [System.IO.Compression.ZipFile]::ExtractToDirectory($pbixBackup, $pbixPkg)

    [System.IO.File]::WriteAllText("$pbixPkg\Report\Layout", $reportJson, $utf16NoBom)
    [System.IO.File]::WriteAllText("$pbixPkg\Settings", $settingsJson, $utf16NoBom)
    [System.IO.File]::WriteAllText("$pbixPkg\Metadata", $metadataJson, $utf16NoBom)
    [System.IO.File]::WriteAllText("$pbixPkg\DiagramLayout", $diagramJson, $utf16NoBom)
    [System.IO.File]::WriteAllText("$pbixPkg\DataModelSchema", $modelBim, $utf16NoBom)

    $themeDir = "$pbixPkg\Report\StaticResources\SharedResources\BaseThemes"
    New-Item -ItemType Directory -Path $themeDir -Force | Out-Null
    [System.IO.File]::WriteAllText("$themeDir\SolvenneTheme.json", $theme, $utf8NoBom)

    if (Test-Path $pbixOut) { Remove-Item $pbixOut -Force }
    [System.IO.Compression.ZipFile]::CreateFromDirectory($pbixPkg, $pbixOut)
    Write-Output "Created PBIX: $pbixOut (Size: $((Get-Item $pbixOut).Length) bytes)"
    Remove-Item $pbixPkg -Recurse -Force
    Remove-Item $pbixBackup -Force
}

Write-Output "Packaging successfully completed!"
