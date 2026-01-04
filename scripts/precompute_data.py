#!/usr/bin/env python3
"""
Precompute AI Adoption Dashboard Data

This script reads the CSV dataset and precomputes all aggregations
to optimize frontend loading performance.
"""

import pandas as pd
import json
from pathlib import Path

# Country coordinates for globe visualization
COUNTRY_COORDINATES = {
    'USA': {'lat': 37.0902, 'lng': -95.7129},
    'Canada': {'lat': 56.1304, 'lng': -106.3468},
    'UK': {'lat': 55.3781, 'lng': -3.4360},
    'France': {'lat': 46.2276, 'lng': 2.2137},
    'Germany': {'lat': 51.1657, 'lng': 10.4515},
    'India': {'lat': 20.5937, 'lng': 78.9629},
    'China': {'lat': 35.8617, 'lng': 104.1954},
    'Japan': {'lat': 36.2048, 'lng': 138.2529},
    'Australia': {'lat': -25.2744, 'lng': 133.7751},
    'Brazil': {'lat': -14.2350, 'lng': -51.9253},
    'South Korea': {'lat': 35.9078, 'lng': 127.7669},
    'Mexico': {'lat': 23.6345, 'lng': -102.5528},
    'Spain': {'lat': 40.4637, 'lng': -3.7492},
    'Italy': {'lat': 41.8719, 'lng': 12.5674},
    'Netherlands': {'lat': 52.1326, 'lng': 5.2913},
    'Sweden': {'lat': 60.1282, 'lng': 18.6435},
    'Switzerland': {'lat': 46.8182, 'lng': 8.2275},
    'Singapore': {'lat': 1.3521, 'lng': 103.8198},
    'UAE': {'lat': 23.4241, 'lng': 53.8478},
    'Russia': {'lat': 61.5240, 'lng': 105.3188},
}


def aggregate_by_country(df):
    """Aggregate data by country."""
    country_stats = df.groupby('country').agg(
        totalUsers=('daily_active_users', 'median'),
        averageAdoption=('adoption_rate', 'mean'),
        count=('country', 'count')
    ).reset_index()

    # Add coordinates
    country_stats['lat'] = country_stats['country'].map(
        lambda x: COUNTRY_COORDINATES.get(x, {}).get('lat', 0)
    )
    country_stats['lng'] = country_stats['country'].map(
        lambda x: COUNTRY_COORDINATES.get(x, {}).get('lng', 0)
    )

    return country_stats.to_dict('records')


def aggregate_by_industry(df):
    """Aggregate data by industry."""
    industry_stats = df.groupby('industry').agg(
        totalUsers=('daily_active_users', 'median'),
        averageAdoption=('adoption_rate', 'mean'),
        count=('industry', 'count')
    ).reset_index()

    industry_stats = industry_stats.sort_values('totalUsers', ascending=False)

    return industry_stats.to_dict('records')


def aggregate_by_tool(df):
    """Aggregate data by AI tool."""
    tool_stats = df.groupby('ai_tool').agg(
        totalUsers=('daily_active_users', 'median'),
        averageAdoption=('adoption_rate', 'mean'),
        count=('ai_tool', 'count')
    ).reset_index()

    tool_stats = tool_stats.rename(columns={'ai_tool': 'tool'})
    tool_stats = tool_stats.sort_values('totalUsers', ascending=False)

    return tool_stats.to_dict('records')


def aggregate_by_year(df):
    """Aggregate data by year."""
    year_stats = df.groupby('year').agg(
        averageAdoption=('adoption_rate', 'mean'),
        totalUsers=('daily_active_users', 'median')
    ).reset_index()

    year_stats = year_stats.sort_values('year')

    return year_stats.to_dict('records')


def aggregate_by_age_group(df):
    """Aggregate data by age group."""
    age_stats = df.groupby('age_group').agg(
        totalUsers=('daily_active_users', 'median'),
        averageAdoption=('adoption_rate', 'mean')
    ).reset_index()

    age_stats = age_stats.rename(columns={'age_group': 'ageGroup'})

    # Sort by age order
    age_order = ['18-24', '25-34', '35-44', '45-54', '55+']
    age_stats['sort_order'] = age_stats['ageGroup'].map(
        lambda x: age_order.index(x) if x in age_order else 999
    )
    age_stats = age_stats.sort_values('sort_order').drop('sort_order', axis=1)

    return age_stats.to_dict('records')


def aggregate_by_company_size(df):
    """Aggregate data by company size."""
    size_stats = df.groupby('company_size').agg(
        totalUsers=('daily_active_users', 'median'),
        averageAdoption=('adoption_rate', 'mean')
    ).reset_index()

    size_stats = size_stats.rename(columns={'company_size': 'size'})

    # Sort by size order
    size_order = ['Startup', 'SME', 'Enterprise']
    size_stats['sort_order'] = size_stats['size'].map(
        lambda x: size_order.index(x) if x in size_order else 999
    )
    size_stats = size_stats.sort_values('sort_order').drop('sort_order', axis=1)

    return size_stats.to_dict('records')


def calculate_dashboard_stats(df, country_data, tool_data):
    """Calculate overall dashboard statistics."""
    total_daily_active_users = int(df['daily_active_users'].sum())
    average_adoption = float(df['adoption_rate'].mean())
    unique_countries = int(df['country'].nunique())
    unique_industries = int(df['industry'].nunique())

    top_tool = tool_data[0]['tool'] if tool_data else 'N/A'

    # Get top country by total users
    country_df = pd.DataFrame(country_data)
    top_country = country_df.loc[country_df['totalUsers'].idxmax(), 'country'] if not country_df.empty else 'N/A'

    return {
        'totalUsers': total_daily_active_users,
        'averageAdoption': average_adoption,
        'totalCountries': unique_countries,
        'totalIndustries': unique_industries,
        'topTool': top_tool,
        'topCountry': top_country
    }


def main():
    print("Loading CSV data...")
    script_dir = Path(__file__).parent
    project_dir = script_dir.parent
    csv_path = project_dir / 'dataset' / 'ai_adoption_dataset.csv'

    # Read CSV
    df = pd.read_csv(csv_path)

    # Filter out rows with missing country or industry
    df = df.dropna(subset=['country', 'industry'])

    print(f"Loaded {len(df)} rows")
    print("Computing aggregations...")

    # Compute all aggregations
    country_data = aggregate_by_country(df)
    industry_data = aggregate_by_industry(df)
    tool_data = aggregate_by_tool(df)
    year_data = aggregate_by_year(df)
    age_group_data = aggregate_by_age_group(df)
    company_size_data = aggregate_by_company_size(df)
    dashboard_stats = calculate_dashboard_stats(df, country_data, tool_data)

    # Get available years
    available_years = sorted(df['year'].unique().tolist())

    # Get raw data for filtering (keep only necessary fields)
    raw_data = df[[
        'country', 'industry', 'ai_tool', 'adoption_rate',
        'daily_active_users', 'year', 'age_group', 'company_size'
    ]].to_dict('records')

    # Create output structure
    output = {
        'rawData': raw_data,
        'aggregations': {
            'byCountry': country_data,
            'byIndustry': industry_data,
            'byTool': tool_data,
            'byYear': year_data,
            'byAgeGroup': age_group_data,
            'byCompanySize': company_size_data
        },
        'dashboardStats': dashboard_stats,
        'availableYears': available_years,
        'metadata': {
            'totalRecords': len(df),
            'generatedAt': pd.Timestamp.now().isoformat(),
            'version': '1.0'
        }
    }

    # Save to JSON
    output_path = project_dir / 'public' / 'precomputed_data.json'
    output_path.parent.mkdir(exist_ok=True)

    print(f"Writing to {output_path}...")
    with open(output_path, 'w') as f:
        json.dump(output, f, indent=2)

    print(f"✓ Successfully generated precomputed data:")
    print(f"  - {len(country_data)} countries")
    print(f"  - {len(industry_data)} industries")
    print(f"  - {len(tool_data)} tools")
    print(f"  - {len(year_data)} years")
    print(f"  - {len(age_group_data)} age groups")
    print(f"  - {len(company_size_data)} company sizes")
    print(f"  - {len(raw_data)} raw data records")
    print(f"\nOutput saved to: {output_path}")


if __name__ == '__main__':
    main()
