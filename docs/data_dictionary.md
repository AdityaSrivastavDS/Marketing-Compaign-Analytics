# Data Dictionary & Schema Specification

This document details the attributes in the SOLVENNE customer intelligence dataset (`marketing_data.csv`), along with the enriched calculated dimensions created in the Power BI Semantic Model (`model.bim`).

---

## 1. Source Columns (28 Raw Attributes)

| Field Name | Type | Description | Sample Values / Constraints |
|:---|:---:|:---|:---|
| `ID` | Integer | Unique identifier for each customer | 1826, 5371, 2125 |
| `Year_Birth` | Integer | Year of birth of the customer | 1893 to 1996 |
| `Education` | String | Highest educational level completed | Graduation, PhD, Master, 2n Cycle, Basic |
| `Marital_Status` | String | Marital / relationship status | Married, Together, Single, Divorced, Widow |
| `Income` | Decimal | Annual household earnings (USD) | 1,730 to 666,666 (24 blanks handled) |
| `Kidhome` | Integer | Number of young children in household | 0, 1, 2 |
| `Teenhome` | Integer | Number of teenagers in household | 0, 1, 2 |
| `Dt_Customer` | Date | Date enrolled in membership program | 2012-07-29 to 2014-06-28 |
| `Recency` | Integer | Days elapsed since last order | 0 to 99 days |
| `MntWines` | Decimal | Total spend on wine in last 2 years | $0 to $1,493 |
| `MntFruits` | Decimal | Total spend on fruits in last 2 years | $0 to $199 |
| `MntMeatProducts` | Decimal | Total spend on meat in last 2 years | $0 to $1,725 |
| `MntFishProducts` | Decimal | Total spend on fish in last 2 years | $0 to $259 |
| `MntSweetProducts` | Decimal | Total spend on sweets in last 2 years | $0 to $263 |
| `MntGoldProds` | Decimal | Total spend on gold products in last 2 years | $0 to $362 |
| `NumDealsPurchases` | Integer | Number of purchases made with discount | 0 to 15 |
| `NumWebPurchases` | Integer | Number of orders completed via website | 0 to 27 |
| `NumCatalogPurchases` | Integer | Number of orders via catalog / mail | 0 to 28 |
| `NumStorePurchases` | Integer | Number of orders in physical stores | 0 to 13 |
| `NumWebVisitsMonth` | Integer | Number of visits to company website in last month | 0 to 20 |
| `AcceptedCmp1` | Boolean (0/1) | Converted in 1st promotional campaign | 144 conversions (6.43%) |
| `AcceptedCmp2` | Boolean (0/1) | Converted in 2nd promotional campaign | 30 conversions (1.34%) |
| `AcceptedCmp3` | Boolean (0/1) | Converted in 3rd promotional campaign | 163 conversions (7.28%) |
| `AcceptedCmp4` | Boolean (0/1) | Converted in 4th promotional campaign | 167 conversions (7.46%) |
| `AcceptedCmp5` | Boolean (0/1) | Converted in 5th promotional campaign | 163 conversions (7.28%) |
| `Response` | Boolean (0/1) | Converted in the most recent campaign | 334 conversions (14.91%) |
| `Complain` | Boolean (0/1) | Registered a customer complaint in last 2 years | 21 complaints (0.94%) |
| `Country` | String | Customer country of residence | Spain, Canada, USA, Germany, India, etc. |

---

## 2. Calculated & Enriched Dimensions (12 Semantic Model Columns)

| Calculated Field | Type | DAX Logic / Definition | Purpose |
|:---|:---:|:---|:---|
| `Age` | Integer | `2014 - Customer[Year_Birth]` | Customer age at study snapshot |
| `Age_Group` | String | `Under 35`, `35 - 49`, `50 - 64`, `65+` | Demographic age cohorting |
| `Age_Plausibility` | String | `IF(Year_Birth < 1920, "Flagged", "Plausible")` | Data quality governance flag |
| `Income_Band` | String | `<$30K`, `$30K-$60K`, `$60K-$90K`, `$90K+`, `Missing` | Income segment brackets |
| `Income_Status` | String | `Reported Income` vs `Missing Income` | Transparent missing data handling |
| `Total_Dependents` | Integer | `Customer[Kidhome] + Customer[Teenhome]` | Household family scale |
| `Has_Children` | String | `Yes (Has Dependents)` vs `No Dependents` | Family status segmentation |
| `Total_Spend` | Decimal | Sum of Wines + Fruits + Meat + Fish + Sweets + Gold | Lifetime recorded expenditure |
| `Total_Purchases` | Integer | `Store + Web + Catalog Purchases` | Aggregate order volume |
| `Spend_Tier` | String | `Low (<$200)`, `Medium ($200-$800)`, `High ($800+)` | Customer value stratification |
| `Preferred_Channel` | String | Channel with highest purchase count | Omnichannel behavior profiling |
| `Campaign_Acceptances` | Integer | `AcceptedCmp1 + AcceptedCmp2 + ... + AcceptedCmp5` | Historical campaign engagement index |
