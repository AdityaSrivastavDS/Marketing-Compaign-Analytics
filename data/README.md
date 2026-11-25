# Marketing Dataset Overview

This directory contains the primary customer transaction and marketing response records for the SOLVENNE Marketing Intelligence platform.

## Dataset Files

- `raw/marketing_data.csv`: Source customer profile, purchasing, and marketing campaign dataset (2,240 rows, 28 fields).
- `raw/marketing_data_dictionary.csv`: Attribute mapping and descriptive metadata.

## Summary Statistics

- **Total Records:** 2,240 customer profiles.
- **Unique Customers:** 2,240 (zero duplicates).
- **Total Spend Across Products:** $1,356,988.
- **Total Purchases:** 28,083 orders (Store: 12,970 | Web: 9,150 | Catalog: 5,963).
- **Time Span:** Customer enrollments between July 2012 and June 2014.

## Data Quality & Preprocessing Notes

1. **Income Handling:**
   - 24 records have missing income values.
   - Handled via calculated flags and explicit DAX measures without altering or dropping source records.
2. **Birth Year Validation:**
   - Three records reflect birth years earlier than 1920 (1893, 1899, 1900).
   - Marked with an `Age_Plausibility` flag in the semantic model to enable targeted filtering while preserving raw integrity.
3. **Column Normalization:**
   - The field ` Income ` containing leading/trailing whitespace is trimmed and standardized to `Income`.
   - Date formats are parsed to standard ISO dates (`YYYY-MM-DD`).
