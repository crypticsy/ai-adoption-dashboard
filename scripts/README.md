# Data Precomputation Scripts

## Overview

This directory contains scripts to precompute aggregations from the AI adoption dataset to optimize frontend loading performance.

## Scripts

### `precompute_data.py`

This script reads the CSV dataset and generates a precomputed JSON file with all aggregations.

#### Requirements

- Python 3.x
- pandas

Install dependencies:
```bash
pip install pandas
```

#### Usage

```bash
cd /path/to/ai-adoption-dashboard
python3 scripts/precompute_data.py
```

#### Output

The script generates `/public/precomputed_data.json` containing:
- Raw data (filtered for valid entries)
- Pre-aggregated data by:
  - Country
  - Industry
  - Tool
  - Year
  - Age Group
  - Company Size
- Dashboard statistics
- Available years
- Metadata (generation time, version, record count)

#### When to Regenerate

Run this script whenever:
- The source CSV data (`/dataset/ai_adoption_dataset.csv`) is updated
- New aggregation metrics are needed
- The aggregation logic changes