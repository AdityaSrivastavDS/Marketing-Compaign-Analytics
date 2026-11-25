# DAX Measures Catalog

The semantic model contains 65 measures organized into 5 dedicated display folders.

## Folder 1: 1. Customer KPIs (11 Measures)
- `Total Customers`: `COUNTROWS(Customer)` - Count of registered customers (2,240).
- `Customers with Income`: Count of customers with non-empty income (2,216).
- `Average Customer Income`: Arithmetic mean of customer annual earnings.
- `Median Income`: Median annual earnings ($51,381.50).
- `Total Recorded Spend`: Sum of expenditures across all 6 product lines ($1,356,988).
- `Average Spend per Customer`: Mean expenditure per customer ($605.80).
- `Customers with Kids`: Count of profiles reporting children under 18 at home.
- `Customers without Dependents`: Count of profiles with no kids or teenagers.
- `Customer Complaint Rate`: Percentage of total customers registering formal complaints (0.94%).
- `Active Customers Ratio`: Ratio of accounts making at least one order in the last 90 days.
- `High Value Customers`: Customers in the top 20th percentile of total spend.

## Folder 2: 2. Campaign KPIs (17 Measures)
- `Campaign 1 Acceptance Rate`: Acceptance percentage for marketing campaign 1 (6.43%).
- `Campaign 2 Acceptance Rate`: Acceptance percentage for marketing campaign 2 (1.34%).
- `Campaign 3 Acceptance Rate`: Acceptance percentage for marketing campaign 3 (7.28%).
- `Campaign 4 Acceptance Rate`: Acceptance percentage for marketing campaign 4 (7.46%).
- `Campaign 5 Acceptance Rate`: Acceptance percentage for marketing campaign 5 (7.28%).
- `Last Campaign Response Rate`: Response percentage for the final promotional wave (14.91%).
- `Total Campaign Responses`: Aggregate responses recorded across all campaigns (1,001).
- `Multi-Campaign Acceptors`: Customers accepting 2 or more historical campaigns.
- `Single Campaign Acceptors`: Customers accepting exactly 1 campaign.
- `Zero Campaign Acceptors`: Customers with zero campaign interactions.
- `Cost per Acquisition (Estimated)`: Ratio of promotional cost to conversions.
- `Campaign Conversion Lift`: Relative lift over non-targeted baseline response.
- `Accepted Any Historical Campaign`: Flag-based count of customers converted prior to final wave (463).
- Additional campaign comparison and historical trend measures.

## Folder 3: 3. Product KPIs (15 Measures)
- `Wine Spend`: Total spend on wine products ($680,816 - 50.2% of total).
- `Meat Spend`: Total spend on meat products ($373,968 - 27.6% of total).
- `Gold Spend`: Total spend on gold products ($98,609 - 7.3% of total).
- `Fish Spend`: Total spend on seafood ($84,057 - 6.2% of total).
- `Sweet Spend`: Total spend on confectionery ($60,621 - 4.5% of total).
- `Fruit Spend`: Total spend on fruits ($58,917 - 4.3% of total).
- Category percentage shares and spend per transaction ratios across each category.

## Folder 4: 4. Channel KPIs (14 Measures)
- `Store Purchases Total`: Store orders (12,970 - 46.2%).
- `Web Purchases Total`: E-commerce orders (9,150 - 32.6%).
- `Catalog Purchases Total`: Mail/catalog orders (5,963 - 21.2%).
- `Discount Purchases Total`: Orders using deal promotions (5,208).
- `Web Visits Monthly`: Total visits to web storefront (11,909).
- Channel contribution percentages, average orders per channel, and digital-to-offline ratios.

## Folder 5: 5. Customer Behaviour KPIs (8 Measures)
- `Recency Average`: Average days since last transaction (49.1 days).
- `Basket Size Average`: Average items per purchasing session.
- `Omnichannel Shoppers`: Customers purchasing across 2 or more distinct channels.
- `Digital First Customers`: Customers with >60% orders from web channels.
- `Store Preferred Customers`: Customers with >60% orders from brick-and-mortar stores.
- Behavioral engagement segmentation and retention indicators.
