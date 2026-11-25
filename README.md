# SOLVENNE Marketing Intelligence Dashboard

[![Power BI](https://img.shields.io/badge/Power_BI-PBIP_%26_PBIR-F2C811?style=flat&logo=powerbi&logoColor=black)](https://powerbi.microsoft.com/)
[![CI Validation](https://img.shields.io/badge/CI-QA_Passing-brightgreen?style=flat&logo=githubactions)](https://github.com/)
[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-339933?style=flat&logo=nodedotjs)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An enterprise-ready **Marketing Intelligence and Customer Analytics** Power BI Project (`.pbip`) built on Microsoft's modern **Enhanced Report Format (PBIR)** and Semantic Data Model (`.bim`). 

The dashboard provides end-to-end intelligence across customer lifetime value, campaign conversion effectiveness, omnichannel purchasing patterns, and demographic segmentation.

---

## Executive Highlights

- **Customer Portfolio:** 2,240 verified profiles across 8 countries.
- **Gross Product Spend:** **$1,356,988** (Wine: 50.2% | Meat: 27.6% | Gold: 7.3% | Fish: 6.2% | Sweets: 4.5% | Fruits: 4.3%).
- **Transaction Volume:** **28,083 orders** (Physical Stores: 46.2% | E-Commerce Web: 32.6% | Direct Mail / Catalog: 21.2%).
- **Final Campaign Response Rate:** **14.91%** (334 customer conversions vs historical campaign average of 5.96%).
- **Customer Satisfaction:** Complaint rate of only **0.94%** (21 total complaints across 2 years).

---

## Repository Structure

```
Marketing-Maven-Dashboard/
│
├── .github/
│   └── workflows/
│       └── ci.yml               # Automated GitHub Actions QA check
│
├── data/
│   ├── raw/
│   │   ├── marketing_data.csv   # Primary customer & transaction dataset (2,240 rows)
│   │   └── marketing_data_dictionary.csv # Source data metadata
│   └── README.md                # Data documentation, quality flags, and statistics
│
├── docs/
│   ├── architecture.md          # Architecture overview: PBIP, PBIR, and Semantic Model
│   ├── data_dictionary.md       # Full dictionary for 28 raw + 12 calculated fields
│   ├── dax_measures.md          # Reference catalog for all 65 DAX measures
│   └── pages_guide.md           # Walkthrough of all 7 analytical report sections
│
├── powerbi/
│   ├── SOLVENNE_Marketing_Intelligence_Dashboard.pbip   # Power BI Project root file
│   ├── SOLVENNE_Marketing_Intelligence_Dashboard.pbit   # Distributable Power BI template
│   ├── SOLVENNE_Marketing_Intelligence_Dashboard.pbix   # Power BI Desktop report with data
│   ├── SOLVENNE_Marketing_Intelligence_Dashboard.Report/        # PBIR enhanced report format
│   └── SOLVENNE_Marketing_Intelligence_Dashboard.SemanticModel/ # Semantic model definition
│
├── scripts/
│   ├── analyze.js               # Statistical distribution & reconciliation script
│   ├── build_complete_dashboard.js # PBIP layout builder and model generator
│   ├── layout_helpers.js        # Coordinate math & visual component generator
│   ├── package_pbi.js           # Node.js packaging utility
│   ├── package_pbi.ps1          # PowerShell packaging utility
│   └── validate_solution.js     # QA test suite validating 100% data and visual integrity
│
├── .gitattributes               # Line ending normalization & Git LFS configuration
├── .gitignore                   # Ignores local Power BI caches, temp files, and node_modules
├── package.json                 # Automation npm scripts
└── README.md                    # Project documentation
```

---

## 7 Comprehensive Analytical Pages

1. **Executive Overview:** High-level executive KPI cards, product share breakdown, channel distribution, and geographic heatmaps.
2. **Demographics & Segmentation:** Income distribution, age cohort analysis, education level correlation, and family structure impact.
3. **Product Intelligence:** Category-level performance, average basket value per demographic group, and cross-sell affinities.
4. **Campaign Analytics:** Performance comparison across promotional waves 1 through 5, last campaign response lift, and complaint drivers.
5. **Channel & Engagement:** Omnichannel purchasing mix, deal sensitivity, web visit conversion rates, and store versus digital preferences.
6. **Customer Value (LTV):** RFM loyalty tiering, customer tenure analysis, and top-tier customer behavioral profiles.
7. **Customer Data Explorer:** Interactive operational table with multi-criteria filtering, sorting, and export capabilities.

---

## Quick Start & Usage

### 1. Opening the Power BI Project
- **Option A (Recommended):** Double-click `powerbi/SOLVENNE_Marketing_Intelligence_Dashboard.pbip` in Power BI Desktop (supports Git integration and PBIR format).
- **Option B (Template):** Open `powerbi/SOLVENNE_Marketing_Intelligence_Dashboard.pbit` to import or refresh with custom parameters.
- **Option C (Compiled Report):** Open `powerbi/SOLVENNE_Marketing_Intelligence_Dashboard.pbix` for immediate offline analysis.

### 2. Running Automated Validation & Tests
Ensure [Node.js](https://nodejs.org/) (v18+) is installed:

```bash
# Run the complete QA validation test suite
npm test

# Run exploratory data analysis and summary statistics
npm run analyze

# Rebuild or update the Power BI project definitions
npm run build
```

---

## Data Model & DAX Architecture

- **Star-Schema Ready Semantic Model:** Defined in `powerbi/...SemanticModel/model.bim`.
- **Enriched Dimensions:** 12 calculated columns including `Age_Group`, `Income_Band`, `RFM_Segment`, and `Age_Plausibility`.
- **65 DAX Measures:** Categorized across 5 display folders:
  - `1. Customer KPIs` (11 measures)
  - `2. Campaign KPIs` (17 measures)
  - `3. Product KPIs` (15 measures)
  - `4. Channel KPIs` (14 measures)
  - `5. Customer Behaviour KPIs` (8 measures)

See [docs/dax_measures.md](docs/dax_measures.md) for complete measure definitions.

---

## Data Governance & Quality Standards

- **Zero Dropped Rows:** 24 missing income records are transparently identified via `Income_Status` flags and dedicated measures.
- **Age Validation:** 3 historical birth years prior to 1920 are segregated via `Age_Plausibility` without modifying raw source records.
- **Git Friendly:** PBIR format decomposes report sections into individual JSON files to prevent team merge conflicts.

---

## License

This project is licensed under the [MIT License](LICENSE).
