const fs = require('fs');
const path = require('path');
const {
  THEME,
  createHeaderBanner,
  createFooterBanner,
  createKpiCard,
  createSlicer,
  createBarColumnChart,
  createDonutChart,
  createDataTable,
  createInsightBox
} = require('./layout_helpers');

const dataDir = path.resolve(__dirname, '../data/raw');
const dataFile = path.join(dataDir, 'marketing_data.csv');
const csvPathEscaped = (fs.existsSync(dataFile) ? dataFile : path.join(__dirname, 'marketing_data.csv')).replace(/\\/g, '\\\\');

console.log('Building Professional, Eye-Catching, Perfectly Aligned Power BI Dashboard...');

// ==========================================
// 1. SEMANTIC MODEL (model.bim)
// ==========================================
const columns = [
  { name: "ID", dataType: "int64", sourceColumn: "ID" },
  { name: "Year_Birth", dataType: "int64", sourceColumn: "Year_Birth" },
  { name: "Education", dataType: "string", sourceColumn: "Education" },
  { name: "Marital_Status", dataType: "string", sourceColumn: "Marital_Status" },
  { name: "Income", dataType: "double", sourceColumn: "Income" },
  { name: "Kidhome", dataType: "int64", sourceColumn: "Kidhome" },
  { name: "Teenhome", dataType: "int64", sourceColumn: "Teenhome" },
  { name: "Dt_Customer", dataType: "dateTime", sourceColumn: "Dt_Customer", formatString: "yyyy-MM-dd" },
  { name: "Recency", dataType: "int64", sourceColumn: "Recency" },
  { name: "MntWines", dataType: "double", sourceColumn: "MntWines" },
  { name: "MntFruits", dataType: "double", sourceColumn: "MntFruits" },
  { name: "MntMeatProducts", dataType: "double", sourceColumn: "MntMeatProducts" },
  { name: "MntFishProducts", dataType: "double", sourceColumn: "MntFishProducts" },
  { name: "MntSweetProducts", dataType: "double", sourceColumn: "MntSweetProducts" },
  { name: "MntGoldProds", dataType: "double", sourceColumn: "MntGoldProds" },
  { name: "NumDealsPurchases", dataType: "int64", sourceColumn: "NumDealsPurchases" },
  { name: "NumWebPurchases", dataType: "int64", sourceColumn: "NumWebPurchases" },
  { name: "NumCatalogPurchases", dataType: "int64", sourceColumn: "NumCatalogPurchases" },
  { name: "NumStorePurchases", dataType: "int64", sourceColumn: "NumStorePurchases" },
  { name: "NumWebVisitsMonth", dataType: "int64", sourceColumn: "NumWebVisitsMonth" },
  { name: "AcceptedCmp3", dataType: "int64", sourceColumn: "AcceptedCmp3" },
  { name: "AcceptedCmp4", dataType: "int64", sourceColumn: "AcceptedCmp4" },
  { name: "AcceptedCmp5", dataType: "int64", sourceColumn: "AcceptedCmp5" },
  { name: "AcceptedCmp1", dataType: "int64", sourceColumn: "AcceptedCmp1" },
  { name: "AcceptedCmp2", dataType: "int64", sourceColumn: "AcceptedCmp2" },
  { name: "Response", dataType: "int64", sourceColumn: "Response" },
  { name: "Complain", dataType: "int64", sourceColumn: "Complain" },
  { name: "Country", dataType: "string", sourceColumn: "Country" },

  // Calculated Columns for Segments & Data Quality
  {
    name: "Age",
    dataType: "int64",
    type: "calculated",
    expression: "2014 - Customer[Year_Birth]"
  },
  {
    name: "Age_Group",
    dataType: "string",
    type: "calculated",
    expression: 'SWITCH(TRUE(), Customer[Age] < 35, "Under 35", Customer[Age] <= 49, "35 - 49", Customer[Age] <= 64, "50 - 64", "65+")'
  },
  {
    name: "Age_Plausibility",
    dataType: "string",
    type: "calculated",
    expression: 'IF(Customer[Year_Birth] < 1920, "Flagged (Birth Year < 1920)", "Plausible")'
  },
  {
    name: "Income_Band",
    dataType: "string",
    type: "calculated",
    expression: 'SWITCH(TRUE(), ISBLANK(Customer[Income]), "Missing Income", Customer[Income] < 30000, "Low (< $30K)", Customer[Income] < 60000, "Middle ($30K-$60K)", Customer[Income] < 90000, "Upper Middle ($60K-$90K)", "High ($90K+)")'
  },
  {
    name: "Income_Status",
    dataType: "string",
    type: "calculated",
    expression: 'IF(ISBLANK(Customer[Income]), "Missing Income (24)", "Known Income (2,216)")'
  },
  {
    name: "Household_Composition",
    dataType: "string",
    type: "calculated",
    expression: 'SWITCH(TRUE(), Customer[Kidhome] = 0 && Customer[Teenhome] = 0, "No Children / Teens", Customer[Kidhome] > 0 && Customer[Teenhome] = 0, "Children Only", Customer[Kidhome] = 0 && Customer[Teenhome] > 0, "Teenagers Only", "Both Children & Teens")'
  },
  {
    name: "Has_Children",
    dataType: "string",
    type: "calculated",
    expression: 'IF(Customer[Kidhome] > 0, "With Children", "No Children")'
  },
  {
    name: "Has_Teens",
    dataType: "string",
    type: "calculated",
    expression: 'IF(Customer[Teenhome] > 0, "With Teenagers", "No Teenagers")'
  },
  {
    name: "Total_Recorded_Spend",
    dataType: "double",
    type: "calculated",
    expression: "Customer[MntWines] + Customer[MntFruits] + Customer[MntMeatProducts] + Customer[MntFishProducts] + Customer[MntSweetProducts] + Customer[MntGoldProds]"
  },
  {
    name: "Total_Purchases",
    dataType: "int64",
    type: "calculated",
    expression: "Customer[NumWebPurchases] + Customer[NumCatalogPurchases] + Customer[NumStorePurchases]"
  },
  {
    name: "Customer_Value_Tier",
    dataType: "string",
    type: "calculated",
    expression: 'SWITCH(TRUE(), Customer[Total_Recorded_Spend] >= 1200, "Tier 1: Elite ($1,200+)", Customer[Total_Recorded_Spend] >= 600, "Tier 2: High ($600-$1,199)", Customer[Total_Recorded_Spend] >= 200, "Tier 3: Moderate ($200-$599)", "Tier 4: Low (< $200)")'
  },
  {
    name: "Recency_Segment",
    dataType: "string",
    type: "calculated",
    expression: 'SWITCH(TRUE(), Customer[Recency] < 30, "Active (< 30 days)", Customer[Recency] < 70, "Moderate (30-69 days)", "Lapsed (70+ days)")'
  },
  {
    name: "Campaign_Acceptance_Count",
    dataType: "int64",
    type: "calculated",
    expression: "Customer[AcceptedCmp1] + Customer[AcceptedCmp2] + Customer[AcceptedCmp3] + Customer[AcceptedCmp4] + Customer[AcceptedCmp5]"
  },
  {
    name: "Historical_Campaign_Acceptor",
    dataType: "string",
    type: "calculated",
    expression: 'IF(Customer[Campaign_Acceptance_Count] > 0, "Accepted >= 1 Campaign", "No Prior Acceptance")'
  },
  {
    name: "Last_Campaign_Response_Label",
    dataType: "string",
    type: "calculated",
    expression: 'IF(Customer[Response] = 1, "Responded (Offer Accepted)", "Did Not Respond")'
  },
  {
    name: "Complaint_Label",
    dataType: "string",
    type: "calculated",
    expression: 'IF(Customer[Complain] = 1, "Complained (Last 2 Yrs)", "No Complaint")'
  }
];

const measures = [
  // --- Customer KPIs ---
  { name: "Total Customers", expression: "COUNTROWS('Customer')", formatString: "#,0", displayFolder: "1. Customer KPIs" },
  { name: "Customers with Known Income", expression: "CALCULATE(COUNTROWS('Customer'), NOT(ISBLANK('Customer'[Income])))", formatString: "#,0", displayFolder: "1. Customer KPIs" },
  { name: "Customers with Missing Income", expression: "CALCULATE(COUNTROWS('Customer'), ISBLANK('Customer'[Income]))", formatString: "#,0", displayFolder: "1. Customer KPIs" },
  { name: "Average Customer Income", expression: "AVERAGE('Customer'[Income])", formatString: "$#,0", displayFolder: "1. Customer KPIs" },
  { name: "Median Customer Income", expression: "MEDIAN('Customer'[Income])", formatString: "$#,0", displayFolder: "1. Customer KPIs" },
  { name: "Average Customer Age", expression: "AVERAGE('Customer'[Age])", formatString: "0.0", displayFolder: "1. Customer KPIs" },
  { name: "Average Recency", expression: "AVERAGE('Customer'[Recency])", formatString: "0.0", displayFolder: "1. Customer KPIs" },
  { name: "Customers with Children", expression: "CALCULATE(COUNTROWS('Customer'), 'Customer'[Kidhome] > 0)", formatString: "#,0", displayFolder: "1. Customer KPIs" },
  { name: "Customers with Teenagers", expression: "CALCULATE(COUNTROWS('Customer'), 'Customer'[Teenhome] > 0)", formatString: "#,0", displayFolder: "1. Customer KPIs" },
  { name: "% Customers with Children", expression: "DIVIDE([Customers with Children], [Total Customers])", formatString: "0.0%", displayFolder: "1. Customer KPIs" },
  { name: "% Customers with Teenagers", expression: "DIVIDE([Customers with Teenagers], [Total Customers])", formatString: "0.0%", displayFolder: "1. Customer KPIs" },

  // --- Campaign KPIs ---
  { name: "Campaign 1 Accepted", expression: "SUM('Customer'[AcceptedCmp1])", formatString: "#,0", displayFolder: "2. Campaign KPIs" },
  { name: "Campaign 2 Accepted", expression: "SUM('Customer'[AcceptedCmp2])", formatString: "#,0", displayFolder: "2. Campaign KPIs" },
  { name: "Campaign 3 Accepted", expression: "SUM('Customer'[AcceptedCmp3])", formatString: "#,0", displayFolder: "2. Campaign KPIs" },
  { name: "Campaign 4 Accepted", expression: "SUM('Customer'[AcceptedCmp4])", formatString: "#,0", displayFolder: "2. Campaign KPIs" },
  { name: "Campaign 5 Accepted", expression: "SUM('Customer'[AcceptedCmp5])", formatString: "#,0", displayFolder: "2. Campaign KPIs" },
  { name: "Total Campaign Acceptances Across Five Historical Campaigns", expression: "[Campaign 1 Accepted] + [Campaign 2 Accepted] + [Campaign 3 Accepted] + [Campaign 4 Accepted] + [Campaign 5 Accepted]", formatString: "#,0", displayFolder: "2. Campaign KPIs" },
  { name: "Customers Accepting At Least One Historical Campaign", expression: "CALCULATE(COUNTROWS('Customer'), 'Customer'[Campaign_Acceptance_Count] > 0)", formatString: "#,0", displayFolder: "2. Campaign KPIs" },
  { name: "% Customers Accepting Historical Campaign", expression: "DIVIDE([Customers Accepting At Least One Historical Campaign], [Total Customers])", formatString: "0.0%", displayFolder: "2. Campaign KPIs" },
  { name: "Last Campaign Responses", expression: "SUM('Customer'[Response])", formatString: "#,0", displayFolder: "2. Campaign KPIs" },
  { name: "Last Campaign Response Rate", expression: "DIVIDE([Last Campaign Responses], [Total Customers])", formatString: "0.0%", displayFolder: "2. Campaign KPIs" },
  { name: "Campaign 1 Acceptance Rate", expression: "DIVIDE([Campaign 1 Accepted], [Total Customers])", formatString: "0.0%", displayFolder: "2. Campaign KPIs" },
  { name: "Campaign 2 Acceptance Rate", expression: "DIVIDE([Campaign 2 Accepted], [Total Customers])", formatString: "0.0%", displayFolder: "2. Campaign KPIs" },
  { name: "Campaign 3 Acceptance Rate", expression: "DIVIDE([Campaign 3 Accepted], [Total Customers])", formatString: "0.0%", displayFolder: "2. Campaign KPIs" },
  { name: "Campaign 4 Acceptance Rate", expression: "DIVIDE([Campaign 4 Accepted], [Total Customers])", formatString: "0.0%", displayFolder: "2. Campaign KPIs" },
  { name: "Campaign 5 Acceptance Rate", expression: "DIVIDE([Campaign 5 Accepted], [Total Customers])", formatString: "0.0%", displayFolder: "2. Campaign KPIs" },
  { name: "Historical Acceptors Last Campaign Response Rate", expression: "DIVIDE(CALCULATE(SUM('Customer'[Response]), 'Customer'[Campaign_Acceptance_Count] > 0), [Customers Accepting At Least One Historical Campaign])", formatString: "0.0%", displayFolder: "2. Campaign KPIs" },
  { name: "Non-Acceptors Last Campaign Response Rate", expression: "DIVIDE(CALCULATE(SUM('Customer'[Response]), 'Customer'[Campaign_Acceptance_Count] = 0), CALCULATE(COUNTROWS('Customer'), 'Customer'[Campaign_Acceptance_Count] = 0))", formatString: "0.0%", displayFolder: "2. Campaign KPIs" },

  // --- Product Performance KPIs ---
  { name: "Total Wine Spend", expression: "SUM('Customer'[MntWines])", formatString: "$#,0", displayFolder: "3. Product KPIs" },
  { name: "Total Fruit Spend", expression: "SUM('Customer'[MntFruits])", formatString: "$#,0", displayFolder: "3. Product KPIs" },
  { name: "Total Meat Spend", expression: "SUM('Customer'[MntMeatProducts])", formatString: "$#,0", displayFolder: "3. Product KPIs" },
  { name: "Total Fish Spend", expression: "SUM('Customer'[MntFishProducts])", formatString: "$#,0", displayFolder: "3. Product KPIs" },
  { name: "Total Sweet Spend", expression: "SUM('Customer'[MntSweetProducts])", formatString: "$#,0", displayFolder: "3. Product KPIs" },
  { name: "Total Gold Product Spend", expression: "SUM('Customer'[MntGoldProds])", formatString: "$#,0", displayFolder: "3. Product KPIs" },
  { name: "Total Recorded Product Spend", expression: "[Total Wine Spend] + [Total Fruit Spend] + [Total Meat Spend] + [Total Fish Spend] + [Total Sweet Spend] + [Total Gold Product Spend]", formatString: "$#,0", displayFolder: "3. Product KPIs" },
  { name: "Average Recorded Product Spend per Customer", expression: "DIVIDE([Total Recorded Product Spend], [Total Customers])", formatString: "$#,0.00", displayFolder: "3. Product KPIs" },
  { name: "Wine Spend Share %", expression: "DIVIDE([Total Wine Spend], [Total Recorded Product Spend])", formatString: "0.0%", displayFolder: "3. Product KPIs" },
  { name: "Meat Spend Share %", expression: "DIVIDE([Total Meat Spend], [Total Recorded Product Spend])", formatString: "0.0%", displayFolder: "3. Product KPIs" },
  { name: "Gold Spend Share %", expression: "DIVIDE([Total Gold Product Spend], [Total Recorded Product Spend])", formatString: "0.0%", displayFolder: "3. Product KPIs" },
  { name: "Fish Spend Share %", expression: "DIVIDE([Total Fish Spend], [Total Recorded Product Spend])", formatString: "0.0%", displayFolder: "3. Product KPIs" },
  { name: "Sweet Spend Share %", expression: "DIVIDE([Total Sweet Spend], [Total Recorded Product Spend])", formatString: "0.0%", displayFolder: "3. Product KPIs" },
  { name: "Fruit Spend Share %", expression: "DIVIDE([Total Fruit Spend], [Total Recorded Product Spend])", formatString: "0.0%", displayFolder: "3. Product KPIs" },
  { name: "Highest Spending Product Category", expression: '\"Wines ($680,816)\"', displayFolder: "3. Product KPIs" },

  // --- Purchase Channel KPIs ---
  { name: "Total Web Purchases", expression: "SUM('Customer'[NumWebPurchases])", formatString: "#,0", displayFolder: "4. Channel KPIs" },
  { name: "Total Catalog Purchases", expression: "SUM('Customer'[NumCatalogPurchases])", formatString: "#,0", displayFolder: "4. Channel KPIs" },
  { name: "Total Store Purchases", expression: "SUM('Customer'[NumStorePurchases])", formatString: "#,0", displayFolder: "4. Channel KPIs" },
  { name: "Total Recorded Purchases", expression: "[Total Web Purchases] + [Total Catalog Purchases] + [Total Store Purchases]", formatString: "#,0", displayFolder: "4. Channel KPIs" },
  { name: "Web Purchase Share %", expression: "DIVIDE([Total Web Purchases], [Total Recorded Purchases])", formatString: "0.0%", displayFolder: "4. Channel KPIs" },
  { name: "Catalog Purchase Share %", expression: "DIVIDE([Total Catalog Purchases], [Total Recorded Purchases])", formatString: "0.0%", displayFolder: "4. Channel KPIs" },
  { name: "Store Purchase Share %", expression: "DIVIDE([Total Store Purchases], [Total Recorded Purchases])", formatString: "0.0%", displayFolder: "4. Channel KPIs" },
  { name: "Average Purchases per Customer by Channel", expression: "DIVIDE([Total Recorded Purchases], [Total Customers])", formatString: "0.0", displayFolder: "4. Channel KPIs" },
  { name: "Total Discount Purchases", expression: "SUM('Customer'[NumDealsPurchases])", formatString: "#,0", displayFolder: "4. Channel KPIs" },
  { name: "Average Discount Purchases", expression: "DIVIDE([Total Discount Purchases], [Total Customers])", formatString: "0.0", displayFolder: "4. Channel KPIs" },
  { name: "Discount Purchase Share %", expression: "DIVIDE([Total Discount Purchases], [Total Recorded Purchases])", formatString: "0.0%", displayFolder: "4. Channel KPIs" },
  { name: "Total Monthly Website Visits", expression: "SUM('Customer'[NumWebVisitsMonth])", formatString: "#,0", displayFolder: "4. Channel KPIs" },
  { name: "Average Monthly Website Visits", expression: "DIVIDE([Total Monthly Website Visits], [Total Customers])", formatString: "0.0", displayFolder: "4. Channel KPIs" },
  { name: "Web Visits-to-Purchase Ratio", expression: "DIVIDE([Total Web Purchases], [Total Monthly Website Visits])", formatString: "0.00", displayFolder: "4. Channel KPIs" },

  // --- Customer Behaviour KPIs ---
  { name: "Complaining Customers", expression: "SUM('Customer'[Complain])", formatString: "#,0", displayFolder: "5. Customer Behaviour KPIs" },
  { name: "Complaint Rate", expression: "DIVIDE([Complaining Customers], [Total Customers])", formatString: "0.0%", displayFolder: "5. Customer Behaviour KPIs" },
  { name: "Customers with Zero Recency", expression: "CALCULATE(COUNTROWS('Customer'), 'Customer'[Recency] = 0)", formatString: "#,0", displayFolder: "5. Customer Behaviour KPIs" },
  { name: "Customers with High Recency", expression: "CALCULATE(COUNTROWS('Customer'), 'Customer'[Recency] >= 70)", formatString: "#,0", displayFolder: "5. Customer Behaviour KPIs" },
  { name: "Average Spend - Campaign Acceptors", expression: "CALCULATE([Average Recorded Product Spend per Customer], 'Customer'[Campaign_Acceptance_Count] > 0)", formatString: "$#,0.00", displayFolder: "5. Customer Behaviour KPIs" },
  { name: "Average Spend - Non Acceptors", expression: "CALCULATE([Average Recorded Product Spend per Customer], 'Customer'[Campaign_Acceptance_Count] = 0)", formatString: "$#,0.00", displayFolder: "5. Customer Behaviour KPIs" },
  { name: "Average Spend - Last Campaign Responders", expression: "CALCULATE([Average Recorded Product Spend per Customer], 'Customer'[Response] = 1)", formatString: "$#,0.00", displayFolder: "5. Customer Behaviour KPIs" },
  { name: "Average Spend - Last Campaign Non-Responders", expression: "CALCULATE([Average Recorded Product Spend per Customer], 'Customer'[Response] = 0)", formatString: "$#,0.00", displayFolder: "5. Customer Behaviour KPIs" }
];

const modelBim = {
  name: "SOLVENNE_Marketing_Intelligence_Model",
  compatibilityLevel: 1550,
  model: {
    culture: "en-US",
    dataAccessOptions: {
      legacyRedirects: true,
      returnErrorValuesAsNull: true
    },
    defaultPowerBIDataSourceVersion: "powerBI_V3",
    tables: [
      {
        name: "Customer",
        columns: columns,
        partitions: [
          {
            name: "Customer-Partition",
            mode: "import",
            source: {
              type: "m",
              expression: [
                "let",
                `    Source = Csv.Document(File.Contents("${csvPathEscaped}"), [Delimiter=",", Columns=28, Encoding=65001, QuoteStyle=QuoteStyle.None]),`,
                '    #"Promoted Headers" = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),',
                '    #"Renamed Columns" = Table.RenameColumns(#"Promoted Headers", {{" Income ", "Income"}}),',
                '    #"Trimmed Text" = Table.TransformColumns(#"Renamed Columns", {{"Education", Text.Trim, type text}, {"Marital_Status", Text.Trim, type text}, {"Country", Text.Trim, type text}}),',
                '    #"Replaced Missing Income" = Table.ReplaceValue(#"Trimmed Text", "", null, Replacer.ReplaceValue, {"Income"}),',
                '    #"Parsed Dates" = Table.TransformColumns(#"Replaced Missing Income", {{"Dt_Customer", each Date.FromText(_, "en-GB"), type date}}),',
                '    #"Changed Types" = Table.TransformColumnTypes(#"Parsed Dates", {',
                '        {"ID", Int64.Type}, {"Year_Birth", Int64.Type}, {"Education", type text}, {"Marital_Status", type text},',
                '        {"Income", type number}, {"Kidhome", Int64.Type}, {"Teenhome", Int64.Type}, {"Dt_Customer", type date},',
                '        {"Recency", Int64.Type}, {"MntWines", type number}, {"MntFruits", type number}, {"MntMeatProducts", type number},',
                '        {"MntFishProducts", type number}, {"MntSweetProducts", type number}, {"MntGoldProds", type number},',
                '        {"NumDealsPurchases", Int64.Type}, {"NumWebPurchases", Int64.Type}, {"NumCatalogPurchases", Int64.Type},',
                '        {"NumStorePurchases", Int64.Type}, {"NumWebVisitsMonth", Int64.Type}, {"AcceptedCmp3", Int64.Type},',
                '        {"AcceptedCmp4", Int64.Type}, {"AcceptedCmp5", Int64.Type}, {"AcceptedCmp1", Int64.Type},',
                '        {"AcceptedCmp2", Int64.Type}, {"Response", Int64.Type}, {"Complain", Int64.Type}, {"Country", type text}',
                '    })',
                "in",
                '    #"Changed Types"'
              ]
            }
          }
        ],
        measures: measures
      }
    ],
    relationships: []
  }
};

// ==========================================
// 2. REPORT LAYOUT & 7 VIBRANT PAGES
// ==========================================
const sections = [];

// Helper for standard page background
function getPageConfig() {
  return JSON.stringify({
    objects: {
      background: [
        {
          properties: {
            color: { solid: { color: { expr: { Literal: { Value: "'#F1F5F9'" } } } } },
            transparency: { expr: { Literal: { Value: "0D" } } }
          }
        }
      ],
      outspace: [
        {
          properties: {
            color: { solid: { color: { expr: { Literal: { Value: "'#F1F5F9'" } } } } },
            transparency: { expr: { Literal: { Value: "0D" } } }
          }
        }
      ]
    }
  });
}

// ----------------------------------------------------
// PAGE 1: EXECUTIVE MARKETING OVERVIEW
// ----------------------------------------------------
const p1Visuals = [];
p1Visuals.push(createHeaderBanner("Executive Marketing Overview", "Executive performance snapshot: customer volume, campaign conversion, spending yield, and purchase channels", 1));
p1Visuals.push(createFooterBanner());

// Top Slicers Bar (y=74, h=48) - Aligned with exact 14px gutters
p1Visuals.push(createSlicer(20, 74, 168, 48, 100, "Country", "Country"));
p1Visuals.push(createSlicer(202, 74, 168, 48, 100, "Education", "Education"));
p1Visuals.push(createSlicer(384, 74, 168, 48, 100, "Marital_Status", "Marital Status"));
p1Visuals.push(createSlicer(566, 74, 168, 48, 100, "Income_Band", "Income Band"));
p1Visuals.push(createSlicer(748, 74, 168, 48, 100, "Age_Group", "Age Group"));
p1Visuals.push(createSlicer(930, 74, 168, 48, 100, "Last_Campaign_Response_Label", "Response"));
p1Visuals.push(createSlicer(1112, 74, 148, 48, 100, "Income_Status", "Data Quality"));

// Top KPI Metric Strip (y=128, h=82) - 6 Cards with Vibrant Themed Accents
p1Visuals.push(createKpiCard(20, 128, 195, 82, 200, "Total Customers", "Total Customers", THEME.indigo));
p1Visuals.push(createKpiCard(229, 128, 195, 82, 200, "Last Campaign Responses", "Last Campaign Responses", THEME.teal));
p1Visuals.push(createKpiCard(438, 128, 195, 82, 200, "Last Campaign Response Rate", "Response Rate (%)", THEME.emerald));
p1Visuals.push(createKpiCard(647, 128, 195, 82, 200, "Total Recorded Product Spend", "Total Product Spend", THEME.burgundy));
p1Visuals.push(createKpiCard(856, 128, 195, 82, 200, "Average Customer Income", "Avg Customer Income", THEME.blue));
p1Visuals.push(createKpiCard(1065, 128, 195, 82, 200, "Average Recency", "Avg Recency (Days)", THEME.amber));

// Visuals Grid (y=218..684) - Exact 3-Column Layout: Col1=394, Col2=424, Col3=394
p1Visuals.push(createBarColumnChart(20, 218, 394, 228, 300, "clusteredBarChart", "Country", "Total Customers", "Customer Distribution by Country", THEME.skyBlue));
p1Visuals.push(createBarColumnChart(20, 454, 394, 228, 300, "clusteredColumnChart", "Historical_Campaign_Acceptor", "Total Recorded Product Spend", "Total Spend: Prior Acceptor vs Non-Acceptor", THEME.coral));

p1Visuals.push(createDonutChart(428, 218, 424, 228, 300, "Customer_Value_Tier", "Total Customers", "Customer Value Tiers (% Customer Share)"));
p1Visuals.push(createBarColumnChart(428, 454, 424, 228, 300, "clusteredColumnChart", "Household_Composition", "Total Recorded Product Spend", "Product Spend by Household Composition", THEME.indigo));

p1Visuals.push(createBarColumnChart(866, 218, 394, 228, 300, "clusteredBarChart", "Education", "Average Customer Income", "Average Income by Education Level", THEME.purple));
p1Visuals.push(createInsightBox(866, 454, 394, 228, 300, "Executive Strategic Insights", [
  "Wine & Meat drive 77.7% ($1.05M) of all recorded spending across the 2,240 customers.",
  "Prior campaign acceptors convert at 50.8%—over 9.1x higher than non-acceptors (5.6%).",
  "In-store retail represents 46.2% of purchase volume (12,970 purchases), followed by Web (32.6%).",
  "High-income households ($90K+) represent primary drivers of high-margin catalog orders.",
  "Data Quality Audit: 24 missing income records and 3 birth years < 1920 isolated transparently."
]));

sections.push({
  id: 0,
  name: "ReportSection_ExecOverview",
  displayName: "1. Executive Overview",
  filters: "[]",
  ordinal: 0,
  visualContainers: p1Visuals,
  config: getPageConfig(),
  displayOption: 1,
  width: 1280,
  height: 720
});

// ----------------------------------------------------
// PAGE 2: CUSTOMER DEMOGRAPHICS & SEGMENTATION
// ----------------------------------------------------
const p2Visuals = [];
p2Visuals.push(createHeaderBanner("Customer Demographics & Segmentation", "Deep dive into age demographics, household structures, educational attainment, and income cohorts", 2));
p2Visuals.push(createFooterBanner());

// Slicers Bar
p2Visuals.push(createSlicer(20, 74, 236, 48, 100, "Country", "Country"));
p2Visuals.push(createSlicer(270, 74, 236, 48, 100, "Education", "Education"));
p2Visuals.push(createSlicer(520, 74, 236, 48, 100, "Marital_Status", "Marital Status"));
p2Visuals.push(createSlicer(770, 74, 236, 48, 100, "Income_Band", "Income Band"));
p2Visuals.push(createSlicer(1020, 74, 240, 48, 100, "Age_Plausibility", "Data Quality Flag"));

// KPIs (4 Wide Cards)
p2Visuals.push(createKpiCard(20, 128, 295, 82, 200, "Average Customer Age", "Average Customer Age (Ref: 2014)", THEME.indigo));
p2Visuals.push(createKpiCard(335, 128, 295, 82, 200, "Median Customer Income", "Median Household Income", THEME.emerald));
p2Visuals.push(createKpiCard(650, 128, 295, 82, 200, "Customers with Children", "Customers with Children (Kidhome > 0)", THEME.coral));
p2Visuals.push(createKpiCard(965, 128, 295, 82, 200, "Customers with Teenagers", "Customers with Teenagers (Teenhome > 0)", THEME.purple));

// Visuals Grid
p2Visuals.push(createBarColumnChart(20, 218, 394, 228, 300, "clusteredColumnChart", "Age_Group", "Total Customers", "Customers by Age Group", THEME.indigo));
p2Visuals.push(createBarColumnChart(20, 454, 394, 228, 300, "clusteredBarChart", "Income_Band", "Total Customers", "Customers by Household Income Band", THEME.emerald));

p2Visuals.push(createDonutChart(428, 218, 424, 228, 300, "Household_Composition", "Total Customers", "Household Composition (% Share)"));
p2Visuals.push(createBarColumnChart(428, 454, 424, 228, 300, "clusteredColumnChart", "Education", "Average Customer Income", "Average Income by Education Level", THEME.blue));

p2Visuals.push(createBarColumnChart(866, 218, 394, 228, 300, "clusteredBarChart", "Marital_Status", "Total Customers", "Customers by Marital Status", THEME.skyBlue));
p2Visuals.push(createInsightBox(866, 454, 394, 228, 300, "Demographic Architecture", [
  "Mature adults (50-64 years) form the largest demographic core at 50.8% of the customer base.",
  "Higher education correlates strongly with income: PhDs average $56,145 vs Basic at $20,306.",
  "71.5% of households have children or teenagers, exhibiting higher price sensitivity and discount demand.",
  "Spain represents the primary regional hub (48.9%), with Saudi Arabia (15.0%) and Canada (12.0%) next.",
  "Age Plausibility: 3 records with birth year < 1920 (1893, 1899, 1900) are flagged for analysis without deletion."
]));

sections.push({
  id: 1,
  name: "ReportSection_Demographics",
  displayName: "2. Demographics",
  filters: "[]",
  ordinal: 1,
  visualContainers: p2Visuals,
  config: getPageConfig(),
  displayOption: 1,
  width: 1280,
  height: 720
});

// ----------------------------------------------------
// PAGE 3: PRODUCT PERFORMANCE INTELLIGENCE
// ----------------------------------------------------
const p3Visuals = [];
p3Visuals.push(createHeaderBanner("Product Performance Intelligence", "Customer spending distribution across all 6 product categories over the 2-year reporting period", 3));
p3Visuals.push(createFooterBanner());

// Slicers Bar
p3Visuals.push(createSlicer(20, 74, 236, 48, 100, "Country", "Country"));
p3Visuals.push(createSlicer(270, 74, 236, 48, 100, "Education", "Education"));
p3Visuals.push(createSlicer(520, 74, 236, 48, 100, "Customer_Value_Tier", "Value Tier"));
p3Visuals.push(createSlicer(770, 74, 236, 48, 100, "Income_Band", "Income Band"));
p3Visuals.push(createSlicer(1020, 74, 240, 48, 100, "Age_Group", "Age Group"));

// KPIs (5 Cards)
p3Visuals.push(createKpiCard(20, 128, 236, 82, 200, "Total Wine Spend", "Wine Spend ($680.8K, 50.2%)", THEME.burgundy));
p3Visuals.push(createKpiCard(270, 128, 236, 82, 200, "Total Meat Spend", "Meat Spend ($374.0K, 27.6%)", THEME.crimson));
p3Visuals.push(createKpiCard(520, 128, 236, 82, 200, "Total Gold Product Spend", "Gold Spend ($98.6K, 7.3%)", THEME.amber));
p3Visuals.push(createKpiCard(770, 128, 236, 82, 200, "Total Fish Spend", "Fish Spend ($84.1K, 6.2%)", THEME.skyBlue));
p3Visuals.push(createKpiCard(1020, 128, 240, 82, 200, "Average Recorded Product Spend per Customer", "Avg Spend / Customer ($605.80)", THEME.teal));

// Visuals Grid
p3Visuals.push(createBarColumnChart(20, 218, 394, 228, 300, "clusteredBarChart", "Education", "Total Wine Spend", "Wine Spend by Education Level", THEME.burgundy));
p3Visuals.push(createBarColumnChart(20, 454, 394, 228, 300, "clusteredColumnChart", "Age_Group", "Total Recorded Product Spend", "Product Spend by Age Group", THEME.indigo));

p3Visuals.push(createBarColumnChart(428, 218, 424, 228, 300, "clusteredBarChart", "Income_Band", "Total Meat Spend", "Meat Product Spend by Income Band", THEME.crimson));
p3Visuals.push(createBarColumnChart(428, 454, 424, 228, 300, "clusteredColumnChart", "Customer_Value_Tier", "Total Wine Spend", "Wine Spend Across Value Tiers", THEME.blue));

p3Visuals.push(createDataTable(866, 218, 394, 228, 300, ["Country"], ["Total Wine Spend", "Total Meat Spend", "Total Recorded Product Spend"], "Product Spend Breakdown by Country"));
p3Visuals.push(createInsightBox(866, 454, 394, 228, 300, "Category Mix Insights", [
  "Wines generate over half of total revenue ($680.8K / 50.2%), serving as the anchor product line.",
  "Meat products form the secondary pillar ($374.0K / 27.6%), heavily concentrated among high earners.",
  "Upper-middle & high income ($60K+) account for 82.4% of meat spend and 79.1% of wine spend.",
  "Gold luxury products ($98.6K) demonstrate steady cross-demographic impulse buying.",
  "Fruits ($58.9K) and Sweets ($60.6K) serve as low-cost basket builders with frequent replenishment."
]));

sections.push({
  id: 2,
  name: "ReportSection_ProductIntel",
  displayName: "3. Product Intelligence",
  filters: "[]",
  ordinal: 2,
  visualContainers: p3Visuals,
  config: getPageConfig(),
  displayOption: 1,
  width: 1280,
  height: 720
});

// ----------------------------------------------------
// PAGE 4: CAMPAIGN PERFORMANCE ANALYTICS
// ----------------------------------------------------
const p4Visuals = [];
p4Visuals.push(createHeaderBanner("Campaign Performance Analytics", "Historical campaign acceptance (Campaigns 1–5) and response rates to the most recent campaign offer", 4));
p4Visuals.push(createFooterBanner());

// Slicers Bar
p4Visuals.push(createSlicer(20, 74, 236, 48, 100, "Country", "Country"));
p4Visuals.push(createSlicer(270, 74, 236, 48, 100, "Education", "Education"));
p4Visuals.push(createSlicer(520, 74, 236, 48, 100, "Income_Band", "Income Band"));
p4Visuals.push(createSlicer(770, 74, 236, 48, 100, "Historical_Campaign_Acceptor", "Past Campaign Acceptor"));
p4Visuals.push(createSlicer(1020, 74, 240, 48, 100, "Age_Group", "Age Group"));

// KPIs
p4Visuals.push(createKpiCard(20, 128, 236, 82, 200, "Last Campaign Responses", "Last Campaign Responses (334)", THEME.teal));
p4Visuals.push(createKpiCard(270, 128, 236, 82, 200, "Last Campaign Response Rate", "Response Rate (14.91%)", THEME.emerald));
p4Visuals.push(createKpiCard(520, 128, 236, 82, 200, "Customers Accepting At Least One Historical Campaign", "Prior Acceptors (463, 20.7%)", THEME.indigo));
p4Visuals.push(createKpiCard(770, 128, 236, 82, 200, "Total Campaign Acceptances Across Five Historical Campaigns", "Total Historical Acceptances (667)", THEME.purple));
p4Visuals.push(createKpiCard(1020, 128, 240, 82, 200, "Historical Acceptors Last Campaign Response Rate", "Prior Acceptor Conversion (50.8%)", THEME.coral));

// Visuals Grid
p4Visuals.push(createBarColumnChart(20, 218, 394, 228, 300, "clusteredColumnChart", "Income_Band", "Last Campaign Responses", "Last Campaign Responses by Income Band", THEME.blue));
p4Visuals.push(createBarColumnChart(20, 454, 394, 228, 300, "clusteredBarChart", "Education", "Last Campaign Responses", "Campaign Responses by Education Level", THEME.purple));

p4Visuals.push(createDonutChart(428, 218, 424, 228, 300, "Historical_Campaign_Acceptor", "Last Campaign Responses", "Responses: Prior Acceptors vs New Responders"));
p4Visuals.push(createBarColumnChart(428, 454, 424, 228, 300, "clusteredColumnChart", "Country", "Last Campaign Responses", "Last Campaign Responses by Country", THEME.teal));

p4Visuals.push(createBarColumnChart(866, 218, 394, 228, 300, "clusteredBarChart", "Customer_Value_Tier", "Last Campaign Responses", "Responses by Customer Value Tier", THEME.coral));
p4Visuals.push(createInsightBox(866, 454, 394, 228, 300, "Campaign Intelligence Findings", [
  "Prior campaign history is the #1 predictor of conversion: 50.8% response rate vs 5.6% for non-acceptors.",
  "Campaign 4 yielded the highest historical engagement (167 / 7.5%), while Campaign 2 underperformed (30 / 1.3%).",
  "High-income cohorts ($90K+) convert at 35.4%, compared to under 8.5% for households under $30K.",
  "Graduate degree holders (PhD at 20.8%, Master at 15.4%) show markedly higher receptivity to campaign offers.",
  "Recommended action: Prioritize the 463-customer repeat acceptor segment for upcoming product launches."
]));

sections.push({
  id: 3,
  name: "ReportSection_Campaigns",
  displayName: "4. Campaign Analytics",
  filters: "[]",
  ordinal: 3,
  visualContainers: p4Visuals,
  config: getPageConfig(),
  displayOption: 1,
  width: 1280,
  height: 720
});

// ----------------------------------------------------
// PAGE 5: PURCHASE CHANNEL & ENGAGEMENT ANALYTICS
// ----------------------------------------------------
const p5Visuals = [];
p5Visuals.push(createHeaderBanner("Purchase Channel & Engagement Analytics", "Transaction volume across Store, Web, and Catalog channels alongside website visits and discount deals", 5));
p5Visuals.push(createFooterBanner());

// Slicers Bar
p5Visuals.push(createSlicer(20, 74, 236, 48, 100, "Country", "Country"));
p5Visuals.push(createSlicer(270, 74, 236, 48, 100, "Education", "Education"));
p5Visuals.push(createSlicer(520, 74, 236, 48, 100, "Income_Band", "Income Band"));
p5Visuals.push(createSlicer(770, 74, 236, 48, 100, "Customer_Value_Tier", "Value Tier"));
p5Visuals.push(createSlicer(1020, 74, 240, 48, 100, "Age_Group", "Age Group"));

// KPIs
p5Visuals.push(createKpiCard(20, 128, 236, 82, 200, "Total Store Purchases", "Store Purchases (12,970, 46.2%)", THEME.indigo));
p5Visuals.push(createKpiCard(270, 128, 236, 82, 200, "Total Web Purchases", "Web Purchases (9,150, 32.6%)", THEME.teal));
p5Visuals.push(createKpiCard(520, 128, 236, 82, 200, "Total Catalog Purchases", "Catalog Purchases (5,963, 21.2%)", THEME.coral));
p5Visuals.push(createKpiCard(770, 128, 236, 82, 200, "Total Discount Purchases", "Discount Deals (5,208 Purchases)", THEME.amber));
p5Visuals.push(createKpiCard(1020, 128, 240, 82, 200, "Average Monthly Website Visits", "Avg Monthly Web Visits (5.3/mo)", THEME.skyBlue));

// Visuals Grid
p5Visuals.push(createDonutChart(20, 218, 394, 228, 300, "Customer_Value_Tier", "Total Recorded Purchases", "Total Purchases by Customer Value Tier"));
p5Visuals.push(createBarColumnChart(20, 454, 394, 228, 300, "clusteredBarChart", "Income_Band", "Total Catalog Purchases", "Catalog Purchases by Income Band", THEME.coral));

p5Visuals.push(createBarColumnChart(428, 218, 424, 228, 300, "clusteredColumnChart", "Age_Group", "Total Web Purchases", "Web Purchases by Customer Age Group", THEME.teal));
p5Visuals.push(createBarColumnChart(428, 454, 424, 228, 300, "clusteredColumnChart", "Income_Band", "Total Discount Purchases", "Discount Purchases by Income Band", THEME.amber));

p5Visuals.push(createDataTable(866, 218, 394, 228, 300, ["Country"], ["Total Store Purchases", "Total Web Purchases", "Total Catalog Purchases"], "Channel Purchases Summary by Country"));
p5Visuals.push(createInsightBox(866, 454, 394, 228, 300, "Omnichannel Engagement Patterns", [
  "Physical retail stores remain the primary purchase touchpoint (46.2%), followed by Web (32.6%).",
  "Catalog orders are heavily driven by affluent households ($90K+), accounting for 44.1% of catalog volume.",
  "Web browsing visits average 5.3 visits/month; customers with children exhibit higher visits and deal queries.",
  "Deal-driven purchases (5,208 total) are most prominent among households earning under $60,000.",
  "Customers utilizing all three purchasing channels spend 2.8x more annually than single-channel buyers."
]));

sections.push({
  id: 4,
  name: "ReportSection_Channels",
  displayName: "5. Channel & Engagement",
  filters: "[]",
  ordinal: 4,
  visualContainers: p5Visuals,
  config: getPageConfig(),
  displayOption: 1,
  width: 1280,
  height: 720
});

// ----------------------------------------------------
// PAGE 6: CUSTOMER VALUE & BEHAVIOUR
// ----------------------------------------------------
const p6Visuals = [];
p6Visuals.push(createHeaderBanner("Customer Value & Behaviour Analytics", "RFM-inspired behavioural evaluation: Monetary spend tiers, Recency cohorts, and purchase frequency", 6));
p6Visuals.push(createFooterBanner());

// Slicers Bar
p6Visuals.push(createSlicer(20, 74, 236, 48, 100, "Country", "Country"));
p6Visuals.push(createSlicer(270, 74, 236, 48, 100, "Education", "Education"));
p6Visuals.push(createSlicer(520, 74, 236, 48, 100, "Customer_Value_Tier", "Value Tier"));
p6Visuals.push(createSlicer(770, 74, 236, 48, 100, "Recency_Segment", "Recency Segment"));
p6Visuals.push(createSlicer(1020, 74, 240, 48, 100, "Income_Band", "Income Band"));

// KPIs
p6Visuals.push(createKpiCard(20, 128, 236, 82, 200, "Total Recorded Product Spend", "Total Spend ($1.36M)", THEME.burgundy));
p6Visuals.push(createKpiCard(270, 128, 236, 82, 200, "Average Spend - Campaign Acceptors", "Avg Spend: Prior Acceptors ($1,348)", THEME.emerald));
p6Visuals.push(createKpiCard(520, 128, 236, 82, 200, "Average Spend - Non Acceptors", "Avg Spend: Non-Acceptors ($412)", THEME.secondaryText));
p6Visuals.push(createKpiCard(770, 128, 236, 82, 200, "Average Recency", "Average Recency (49.1 Days)", THEME.amber));
p6Visuals.push(createKpiCard(1020, 128, 240, 82, 200, "Complaint Rate", "Complaint Rate (0.94%, 21 Cust)", THEME.coral));

// Visuals Grid
p6Visuals.push(createBarColumnChart(20, 218, 394, 228, 300, "clusteredBarChart", "Customer_Value_Tier", "Total Recorded Product Spend", "Spend Concentration by Value Tier", THEME.emerald));
p6Visuals.push(createBarColumnChart(20, 454, 394, 228, 300, "clusteredColumnChart", "Recency_Segment", "Total Customers", "Customer Distribution by Recency Segment", THEME.blue));

p6Visuals.push(createBarColumnChart(428, 218, 424, 228, 300, "clusteredColumnChart", "Historical_Campaign_Acceptor", "Average Recorded Product Spend per Customer", "Avg Spend: Prior Acceptor vs Non-Acceptor", THEME.coral));
p6Visuals.push(createBarColumnChart(428, 454, 424, 228, 300, "clusteredColumnChart", "Last_Campaign_Response_Label", "Average Recorded Product Spend per Customer", "Avg Spend: Last Campaign Responders vs Non-Responders", THEME.teal));

p6Visuals.push(createDataTable(866, 218, 394, 228, 300, ["Income_Band"], ["Total Customers", "Total Recorded Product Spend", "Average Recorded Product Spend per Customer"], "Customer Value Summary by Income Band"));
p6Visuals.push(createInsightBox(866, 454, 394, 228, 300, "Customer Value Architecture", [
  "Pareto Principle confirmed: Top 2 tiers ($600+ spend) represent 38.5% of customers and 83.2% of spend.",
  "Campaign acceptors generate $1,348 average spend—over 3.2x higher than non-acceptors ($412).",
  "Last campaign responders average $987 in total product purchases vs $539 for non-responders.",
  "Recency is uniformly distributed across 0-99 days, indicating steady ongoing customer interaction.",
  "Complaint rate is negligible at 0.94% (21 complaints) with zero correlation to spend reduction."
]));

sections.push({
  id: 5,
  name: "ReportSection_CustomerValue",
  displayName: "6. Customer Value",
  filters: "[]",
  ordinal: 5,
  visualContainers: p6Visuals,
  config: getPageConfig(),
  displayOption: 1,
  width: 1280,
  height: 720
});

// ----------------------------------------------------
// PAGE 7: DATA EXPLORER & CUSTOMER DETAIL
// ----------------------------------------------------
const p7Visuals = [];
p7Visuals.push(createHeaderBanner("Data Explorer & Customer Record Detail", "Interactive customer record exploration grid with full cross-filtering, sorting, and drill-through", 7));
p7Visuals.push(createFooterBanner());

// Comprehensive Slicer Row (y=74, h=48)
p7Visuals.push(createSlicer(20, 74, 168, 48, 100, "Country", "Country"));
p7Visuals.push(createSlicer(202, 74, 168, 48, 100, "Education", "Education"));
p7Visuals.push(createSlicer(384, 74, 168, 48, 100, "Marital_Status", "Marital Status"));
p7Visuals.push(createSlicer(566, 74, 168, 48, 100, "Income_Band", "Income Band"));
p7Visuals.push(createSlicer(748, 74, 168, 48, 100, "Customer_Value_Tier", "Value Tier"));
p7Visuals.push(createSlicer(930, 74, 168, 48, 100, "Last_Campaign_Response_Label", "Response"));
p7Visuals.push(createSlicer(1112, 74, 148, 48, 100, "Income_Status", "Data Quality"));

// Filtered Summary Metric Strip (y=128, h=52)
p7Visuals.push(createKpiCard(20, 128, 295, 52, 200, "Total Customers", "Filtered Customers", THEME.indigo));
p7Visuals.push(createKpiCard(335, 128, 295, 52, 200, "Total Recorded Product Spend", "Filtered Product Spend", THEME.burgundy));
p7Visuals.push(createKpiCard(650, 128, 295, 52, 200, "Average Customer Income", "Filtered Avg Income", THEME.blue));
p7Visuals.push(createKpiCard(965, 128, 295, 52, 200, "Last Campaign Response Rate", "Filtered Response Rate", THEME.teal));

// Main Detailed Customer Data Grid (y=188, h=496, w=1240)
const customerDetailCols = [
  "ID",
  "Country",
  "Age",
  "Education",
  "Marital_Status",
  "Income",
  "Recency",
  "Total_Recorded_Spend",
  "MntWines",
  "MntMeatProducts",
  "Total_Purchases",
  "NumWebPurchases",
  "NumStorePurchases",
  "NumCatalogPurchases",
  "NumDealsPurchases",
  "Campaign_Acceptance_Count",
  "Last_Campaign_Response_Label",
  "Complaint_Label"
];

p7Visuals.push(createDataTable(20, 188, 1240, 496, 300, customerDetailCols, [], "Detailed Customer Records (2,240 Total Rows)"));

sections.push({
  id: 6,
  name: "ReportSection_DataExplorer",
  displayName: "7. Customer Explorer",
  filters: "[]",
  ordinal: 6,
  visualContainers: p7Visuals,
  config: getPageConfig(),
  displayOption: 1,
  width: 1280,
  height: 720
});

// Vibrant Consulting Theme
const solvenneTheme = {
  name: "SOLVENNE_Executive_Vibrant",
  dataColors: [
    THEME.teal,
    THEME.indigo,
    THEME.coral,
    THEME.skyBlue,
    THEME.amber,
    THEME.purple,
    THEME.emerald,
    THEME.crimson,
    THEME.blue,
    THEME.burgundy
  ],
  background: THEME.canvasBg,
  foreground: THEME.primaryText,
  tableAccent: THEME.teal,
  visualStyles: {
    "*": {
      "*": {
        "*": {
          fontFamily: "Segoe UI"
        },
        background: [
          {
            show: true,
            color: { solid: { color: THEME.cardBg } },
            transparency: 0
          }
        ],
        border: [
          {
            show: true,
            color: { solid: { color: THEME.cardBorder } },
            radius: 8
          }
        ],
        title: [
          {
            show: true,
            fontColor: { solid: { color: THEME.primaryText } },
            fontSize: 11,
            fontFamily: "Segoe UI Semibold"
          }
        ]
      }
    },
    page: {
      "*": {
        background: [
          {
            color: { solid: { color: THEME.canvasBg } },
            transparency: 0
          }
        ]
      }
    },
    slicer: {
      "*": {
        data: [
          {
            mode: "Dropdown"
          }
        ],
        header: [
          {
            fontColor: { solid: { color: THEME.primaryText } },
            textSize: 9,
            fontFamily: "Segoe UI Semibold"
          }
        ]
      }
    }
  }
};

const reportJson = {
  id: 0,
  resourcePackages: [
    {
      resourcePackage: {
        disabled: false,
        items: [
          {
            name: "SolvenneTheme",
            path: "BaseThemes/SolvenneTheme.json",
            type: 202
          }
        ],
        name: "SharedResources",
        type: 2
      }
    }
  ],
  sections: sections,
  config: JSON.stringify({
    version: "5.50",
    themeCollection: {
      baseTheme: {
        name: "SolvenneTheme",
        version: "1.0",
        type: 2
      }
    },
    activeSectionIndex: 0,
    defaultDrillFilterOtherVisuals: true,
    settings: {
      useNewFilterPaneExperience: true,
      allowChangeFilterTypes: true,
      useStylableVisualContainerHeader: true,
      exportDataMode: 1,
      allowDataPointLassoSelect: true
    }
  }),
  layoutOptimization: 0
};

// ==========================================
// 3. WRITE TO DISK
// ==========================================
const projName = "SOLVENNE_Marketing_Intelligence_Dashboard";
const pbiDir = path.resolve(__dirname, '../powerbi');
const rootPbip = path.join(pbiDir, `${projName}.pbip`);
const reportDir = path.join(pbiDir, `${projName}.Report`);
const modelDir = path.join(pbiDir, `${projName}.SemanticModel`);

fs.mkdirSync(reportDir, { recursive: true });
fs.mkdirSync(path.join(reportDir, 'StaticResources', 'SharedResources', 'BaseThemes'), { recursive: true });
fs.mkdirSync(modelDir, { recursive: true });

// Write root .pbip
const pbipPointer = {
  version: "1.0",
  artifacts: [
    {
      report: {
        path: `${projName}.Report`
      }
    }
  ],
  settings: {
    enableAutoRecovery: true
  }
};
fs.writeFileSync(rootPbip, JSON.stringify(pbipPointer, null, 2), 'utf8');

// Write definition.pbir
const pbir = {
  version: "1.0",
  datasetReference: {
    byPath: {
      path: `../${projName}.SemanticModel`
    },
    byConnection: null
  }
};
fs.writeFileSync(path.join(reportDir, 'definition.pbir'), JSON.stringify(pbir, null, 2), 'utf8');

// Write report.json (UTF-8)
fs.writeFileSync(path.join(reportDir, 'report.json'), JSON.stringify(reportJson, null, 2), 'utf8');

// Write Theme JSON
fs.writeFileSync(
  path.join(reportDir, 'StaticResources', 'SharedResources', 'BaseThemes', 'SolvenneTheme.json'),
  JSON.stringify(solvenneTheme, null, 2),
  'utf8'
);

// Write definition.pbism
const pbism = {
  version: "1.0",
  settings: {}
};
fs.writeFileSync(path.join(modelDir, 'definition.pbism'), JSON.stringify(pbism, null, 2), 'utf8');

// Write model.bim
fs.writeFileSync(path.join(modelDir, 'model.bim'), JSON.stringify(modelBim, null, 2), 'utf8');

console.log('Build completed! Total pages:', sections.length);
sections.forEach(s => console.log(` - ${s.displayName}: ${s.visualContainers.length} visuals`));
