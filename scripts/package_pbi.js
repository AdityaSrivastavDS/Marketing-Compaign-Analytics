const fs = require('fs');
const path = require('path');
const cp = require('child_process');

console.log('Packaging SOLVENNE Power BI files...');

const projName = "SOLVENNE_Marketing_Intelligence_Dashboard";
const baseDir = path.resolve(__dirname, '../powerbi');
const reportDir = path.join(baseDir, `${projName}.Report`);
const modelDir = path.join(baseDir, `${projName}.SemanticModel`);

let reportJsonPath = path.join(reportDir, 'report.json');
if (!fs.existsSync(reportJsonPath)) {
  reportJsonPath = path.join(reportDir, 'definition', 'report.json');
}
const modelBimPath = path.join(modelDir, 'model.bim');
const themePath = path.join(reportDir, 'StaticResources', 'SharedResources', 'BaseThemes', 'SolvenneTheme.json');

const reportJsonStr = fs.existsSync(reportJsonPath) ? fs.readFileSync(reportJsonPath, 'utf8') : '{}';
const modelBimStr = fs.existsSync(modelBimPath) ? fs.readFileSync(modelBimPath, 'utf8') : '{}';
const themeStr = fs.existsSync(themePath) ? fs.readFileSync(themePath, 'utf8') : '{}';

// Convert to UTF-16LE buffers (standard for Power BI internal streams)
const layoutBuffer = Buffer.from(reportJsonStr, 'utf16le');
const modelSchemaBuffer = Buffer.from(modelBimStr, 'utf16le');
const themeBuffer = Buffer.from(themeStr, 'utf8');

// Settings JSON
const settingsJson = JSON.stringify({
  Version: 1,
  ReportSettings: {},
  QueriesSettings: {
    TypeDetectionEnabled: true,
    RelationshipImportEnabled: true,
    RunBackgroundAnalysis: true,
    Version: "2.81.5831.821"
  }
});
const settingsBuffer = Buffer.from(settingsJson, 'utf16le');

// Metadata JSON
const metadataJson = JSON.stringify({
  Version: 5,
  AutoCreatedRelationships: [],
  FileDescription: "SOLVENNE Marketing Intelligence & Customer Analytics Dashboard",
  CreatedFrom: "Desktop",
  CreatedFromRelease: "2024.02"
});
const metadataBuffer = Buffer.from(metadataJson, 'utf16le');

// Version text
const versionBuffer = Buffer.from("1.25\n", 'utf8');

// Diagram Layout
const diagramLayoutJson = JSON.stringify({
  version: "1.1.0",
  diagrams: [
    {
      ordinal: 0,
      scrollPosition: { x: 0, y: 0 },
      nodes: [
        {
          location: { x: 100, y: 100 },
          nodeType: "Table",
          nodeTitle: "Customer",
          nodeId: "Customer",
          size: { width: 250, height: 500 },
          zIndex: 0
        }
      ],
      zoomValue: 100,
      pinKeyFieldsToTop: false,
      showExtraHeaderInfo: false,
      hideKeyFieldsWhenCollapsed: false,
      tablesExpanded: true
    }
  ]
});
const diagramBuffer = Buffer.from(diagramLayoutJson, 'utf16le');

// [Content_Types].xml
const contentTypesXml = `<?xml version="1.0" encoding="utf-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="txt" ContentType="text/plain" />
  <Default Extension="xml" ContentType="text/xml" />
  <Default Extension="json" ContentType="application/json" />
  <Override PartName="/Version" ContentType="application/octet-stream" />
  <Override PartName="/Settings" ContentType="application/octet-stream" />
  <Override PartName="/Metadata" ContentType="application/octet-stream" />
  <Override PartName="/DiagramLayout" ContentType="application/octet-stream" />
  <Override PartName="/DataModelSchema" ContentType="application/octet-stream" />
  <Override PartName="/Report/Layout" ContentType="application/octet-stream" />
  <Override PartName="/Report/StaticResources/SharedResources/BaseThemes/SolvenneTheme.json" ContentType="application/json" />
</Types>`;
const contentTypesBuffer = Buffer.from(contentTypesXml, 'utf8');

// Create temp packaging folder for .pbit
const pkgDir = path.join(__dirname, 'temp_pbit_pkg');
if (fs.existsSync(pkgDir)) fs.rmSync(pkgDir, { recursive: true, force: true });
fs.mkdirSync(pkgDir, { recursive: true });
fs.mkdirSync(path.join(pkgDir, 'Report'), { recursive: true });
fs.mkdirSync(path.join(pkgDir, 'Report', 'StaticResources', 'SharedResources', 'BaseThemes'), { recursive: true });

fs.writeFileSync(path.join(pkgDir, 'Version'), versionBuffer);
fs.writeFileSync(path.join(pkgDir, '[Content_Types].xml'), contentTypesBuffer);
fs.writeFileSync(path.join(pkgDir, 'Settings'), settingsBuffer);
fs.writeFileSync(path.join(pkgDir, 'Metadata'), metadataBuffer);
fs.writeFileSync(path.join(pkgDir, 'DiagramLayout'), diagramBuffer);
fs.writeFileSync(path.join(pkgDir, 'DataModelSchema'), modelSchemaBuffer);
fs.writeFileSync(path.join(pkgDir, 'Report', 'Layout'), layoutBuffer);
fs.writeFileSync(path.join(pkgDir, 'Report', 'StaticResources', 'SharedResources', 'BaseThemes', 'SolvenneTheme.json'), themeBuffer);

const pbitOut = path.join(baseDir, `${projName}.pbit`);
if (fs.existsSync(pbitOut)) fs.unlinkSync(pbitOut);

// Use PowerShell Compress-Archive to build .pbit
const pbitZipCmd = `Get-ChildItem -Path "${pkgDir.replace(/\\/g, '\\\\')}\\*" | Compress-Archive -DestinationPath "${pbitOut.replace(/\\/g, '\\\\')}" -Force`;
cp.execSync(`powershell -Command "${pbitZipCmd}"`, { stdio: 'inherit' });
console.log(`Generated PBIT template: ${pbitOut} (${fs.statSync(pbitOut).size} bytes)`);

// Now build .pbix from base container
const pbixOut = path.join(baseDir, `${projName}.pbix`);
if (fs.existsSync(pbixOut)) fs.unlinkSync(pbixOut);

// For .pbix:
// We extract base sample.pbix, replace Report/Layout and metadata/settings/diagram, and recompress
const pbixPkgDir = path.join(__dirname, 'temp_pbix_pkg');
if (fs.existsSync(pbixPkgDir)) fs.rmSync(pbixPkgDir, { recursive: true, force: true });
fs.mkdirSync(pbixPkgDir, { recursive: true });

// Extract sample.pbix
const unzipCmd = `Expand-Archive -Path "sample.pbix" -DestinationPath "${pbixPkgDir.replace(/\\/g, '\\\\')}" -Force`;
cp.execSync(`powershell -Command "${unzipCmd}"`, { stdio: 'inherit' });

// Overwrite Report/Layout with our complete 7-page SOLVENNE layout
fs.writeFileSync(path.join(pbixPkgDir, 'Report', 'Layout'), layoutBuffer);
fs.writeFileSync(path.join(pbixPkgDir, 'Settings'), settingsBuffer);
fs.writeFileSync(path.join(pbixPkgDir, 'Metadata'), metadataBuffer);
fs.writeFileSync(path.join(pbixPkgDir, 'DiagramLayout'), diagramBuffer);

// Also add SolvenneTheme
const pbixThemeDir = path.join(pbixPkgDir, 'Report', 'StaticResources', 'SharedResources', 'BaseThemes');
fs.mkdirSync(pbixThemeDir, { recursive: true });
fs.writeFileSync(path.join(pbixThemeDir, 'SolvenneTheme.json'), themeBuffer);

// Re-compress into SOLVENNE_Marketing_Intelligence_Dashboard.pbix
const pbixZipCmd = `Get-ChildItem -Path "${pbixPkgDir.replace(/\\/g, '\\\\')}\\*" | Compress-Archive -DestinationPath "${pbixOut.replace(/\\/g, '\\\\')}" -Force`;
cp.execSync(`powershell -Command "${pbixZipCmd}"`, { stdio: 'inherit' });
console.log(`Generated PBIX report: ${pbixOut} (${fs.statSync(pbixOut).size} bytes)`);

// Clean up temp directories
fs.rmSync(pkgDir, { recursive: true, force: true });
fs.rmSync(pbixPkgDir, { recursive: true, force: true });

console.log('Packaging complete!');
