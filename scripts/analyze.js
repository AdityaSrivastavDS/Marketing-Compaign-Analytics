const fs = require('fs');
const path = require('path');

const defaultDataPath = path.resolve(__dirname, '../data/raw/marketing_data.csv');
const fallbackDataPath = path.resolve(__dirname, 'marketing_data.csv');
const dataPath = process.env.DATA_PATH || (fs.existsSync(defaultDataPath) ? defaultDataPath : fallbackDataPath);

console.log('Loading dataset from:', dataPath);
const content = fs.readFileSync(dataPath, 'utf8');
const lines = content.trim().split(/\r?\n/);
const header = lines[0].split(',').map(h => h.trim());
console.log('Header count:', header.length);
console.log('Cleaned Headers:', header);
console.log('Total rows:', lines.length - 1);

let missingIncome = 0;
let minYear = 9999, maxYear = 0;
let minIncome = 999999999, maxIncome = 0;
let sumWines = 0, sumFruits = 0, sumMeat = 0, sumFish = 0, sumSweets = 0, sumGold = 0;
let sumWeb = 0, sumCat = 0, sumStore = 0, sumDeals = 0, sumWebVisits = 0;
let sumCmp1 = 0, sumCmp2 = 0, sumCmp3 = 0, sumCmp4 = 0, sumCmp5 = 0, sumResponse = 0, sumComplain = 0;
let atLeastOneCmp = 0;
let countries = {}, educations = {}, maritals = {};
let dates = [];
let incomeValues = [];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  const parts = line.split(',');
  const row = {};
  for (let j = 0; j < header.length; j++) {
    row[header[j]] = parts[j] ? parts[j].trim() : '';
  }

  const incStr = row['Income'];
  if (!incStr || isNaN(Number(incStr))) {
    missingIncome++;
  } else {
    const inc = Number(incStr);
    incomeValues.push(inc);
    if (inc < minIncome) minIncome = inc;
    if (inc > maxIncome) maxIncome = inc;
  }

  const y = Number(row['Year_Birth']);
  if (y < minYear) minYear = y;
  if (y > maxYear) maxYear = y;

  sumWines += Number(row['MntWines']) || 0;
  sumFruits += Number(row['MntFruits']) || 0;
  sumMeat += Number(row['MntMeatProducts']) || 0;
  sumFish += Number(row['MntFishProducts']) || 0;
  sumSweets += Number(row['MntSweetProducts']) || 0;
  sumGold += Number(row['MntGoldProds']) || 0;

  sumWeb += Number(row['NumWebPurchases']) || 0;
  sumCat += Number(row['NumCatalogPurchases']) || 0;
  sumStore += Number(row['NumStorePurchases']) || 0;
  sumDeals += Number(row['NumDealsPurchases']) || 0;
  sumWebVisits += Number(row['NumWebVisitsMonth']) || 0;

  const c1 = Number(row['AcceptedCmp1']) || 0;
  const c2 = Number(row['AcceptedCmp2']) || 0;
  const c3 = Number(row['AcceptedCmp3']) || 0;
  const c4 = Number(row['AcceptedCmp4']) || 0;
  const c5 = Number(row['AcceptedCmp5']) || 0;
  sumCmp1 += c1;
  sumCmp2 += c2;
  sumCmp3 += c3;
  sumCmp4 += c4;
  sumCmp5 += c5;
  if (c1 + c2 + c3 + c4 + c5 > 0) atLeastOneCmp++;

  sumResponse += Number(row['Response']) || 0;
  sumComplain += Number(row['Complain']) || 0;

  countries[row['Country']] = (countries[row['Country']] || 0) + 1;
  educations[row['Education']] = (educations[row['Education']] || 0) + 1;
  maritals[row['Marital_Status']] = (maritals[row['Marital_Status']] || 0) + 1;
  dates.push(row['Dt_Customer']);
}

incomeValues.sort((a, b) => a - b);
const medianIncome = incomeValues.length % 2 === 0
  ? (incomeValues[incomeValues.length / 2 - 1] + incomeValues[incomeValues.length / 2]) / 2
  : incomeValues[Math.floor(incomeValues.length / 2)];
const avgIncome = incomeValues.reduce((a, b) => a + b, 0) / incomeValues.length;

console.log('--- RECONCILIATION SUMMARY ---');
console.log('Total Customers:', lines.length - 1);
console.log('Customers with Known Income:', incomeValues.length);
console.log('Missing Income count:', missingIncome);
console.log('Min Income:', minIncome, 'Max Income:', maxIncome, 'Avg Income:', avgIncome.toFixed(2), 'Median Income:', medianIncome);
console.log('Min Year_Birth:', minYear, 'Max Year_Birth:', maxYear);
console.log('Wine Spend:', sumWines);
console.log('Fruit Spend:', sumFruits);
console.log('Meat Spend:', sumMeat);
console.log('Fish Spend:', sumFish);
console.log('Sweet Spend:', sumSweets);
console.log('Gold Spend:', sumGold);
const totalSpend = sumWines + sumFruits + sumMeat + sumFish + sumSweets + sumGold;
console.log('Total Recorded Product Spend:', totalSpend);
console.log('Average Spend Per Customer:', (totalSpend / (lines.length - 1)).toFixed(2));
console.log('Web Purchases:', sumWeb);
console.log('Catalog Purchases:', sumCat);
console.log('Store Purchases:', sumStore);
console.log('Total Recorded Purchases:', sumWeb + sumCat + sumStore);
console.log('Deals Purchases:', sumDeals);
console.log('Monthly Web Visits:', sumWebVisits);
console.log('Campaign 1 Accepted:', sumCmp1);
console.log('Campaign 2 Accepted:', sumCmp2);
console.log('Campaign 3 Accepted:', sumCmp3);
console.log('Campaign 4 Accepted:', sumCmp4);
console.log('Campaign 5 Accepted:', sumCmp5);
console.log('Total Historical Campaign Acceptances:', sumCmp1 + sumCmp2 + sumCmp3 + sumCmp4 + sumCmp5);
console.log('Customers Accepting At Least One Historical Campaign:', atLeastOneCmp);
console.log('Last Campaign Responses:', sumResponse);
console.log('Last Campaign Response Rate:', ((sumResponse / (lines.length - 1)) * 100).toFixed(2) + '%');
console.log('Complaints:', sumComplain);
console.log('Complaint Rate:', ((sumComplain / (lines.length - 1)) * 100).toFixed(2) + '%');
console.log('Countries:', JSON.stringify(countries));
console.log('Educations:', JSON.stringify(educations));
console.log('Marital Statuses:', JSON.stringify(maritals));

// Date analysis
const parsedDates = dates.map(d => {
  const [day, month, year] = d.split('-').map(Number);
  return new Date(year, month - 1, day);
});
parsedDates.sort((a, b) => a - b);
console.log('Enrollment Date Min:', parsedDates[0].toISOString().slice(0, 10), 'Max:', parsedDates[parsedDates.length - 1].toISOString().slice(0, 10));
