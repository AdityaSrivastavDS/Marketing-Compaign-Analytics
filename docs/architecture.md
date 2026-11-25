# Solution Architecture

This document describes the architectural layout of the SOLVENNE Marketing Intelligence Dashboard, utilizing Microsoft Power BI Desktop Projects (`.pbip`) and the modern Enhanced Report Format (`PBIR`).

## 1. Architectural Components

```
+-----------------------------------------------------------+
|                      Raw Data Layer                       |
|   - data/raw/marketing_data.csv (2,240 records, 28 cols)  |
+-----------------------------------------------------------+
                             |
                             v
+-----------------------------------------------------------+
|                   Semantic Data Model                     |
|   - powerbi/SOLVENNE_Marketing_Intelligence_Dashboard     |
|     .SemanticModel/model.bim                              |
|   - 44 Total Columns (28 raw + 12 enriched dimensions)   |
|   - 65 DAX Measures categorized across 5 domains          |
+-----------------------------------------------------------+
                             |
                             v
+-----------------------------------------------------------+
|              PBIR Enhanced Report Format                  |
|   - Individual page folders with modular visual JSONs     |
|   - Git-friendly branch merges & source control           |
|   - 7 Analytical Pages & custom SolvenneTheme             |
+-----------------------------------------------------------+
                             |
                             v
+-----------------------------------------------------------+
|              Power BI Desktop & Delivery Formats          |
|   - powerbi/..._Dashboard.pbip (Modern Project format)    |
|   - powerbi/..._Dashboard.pbix (Standalone desktop file)  |
|   - powerbi/..._Dashboard.pbit (Parameterized template)   |
+-----------------------------------------------------------+
```

## 2. Power BI Project (PBIP) & PBIR Benefits

1. **Granular Version Control:**
   - Instead of a monolithic binary `.pbix` file, reports are decomposed into granular JSON structures under `definition/pages/`.
   - Each visual container maintains its own `visual.json`, preventing team merge conflicts.
2. **Template Portability:**
   - The `.pbit` template allows team members to connect to their own local environment or parameterize the CSV input path.
3. **Automated Continuous Integration:**
   - CI workflows validate JSON schemas, column counts, and measures on every commit.
