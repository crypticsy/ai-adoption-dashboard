import Papa from 'papaparse';
import type { AIAdoptionData, CountryData, IndustryData, ToolData, TrendData, AgeGroupData, CompanySizeData, DashboardStats, PrecomputedData } from '../types';

// Helper function to calculate median
function calculateMedian(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

// Country coordinates for globe visualization
const countryCoordinates: Record<string, { lat: number; lng: number }> = {
  'USA': { lat: 37.0902, lng: -95.7129 },
  'Canada': { lat: 56.1304, lng: -106.3468 },
  'UK': { lat: 55.3781, lng: -3.4360 },
  'France': { lat: 46.2276, lng: 2.2137 },
  'Germany': { lat: 51.1657, lng: 10.4515 },
  'India': { lat: 20.5937, lng: 78.9629 },
  'China': { lat: 35.8617, lng: 104.1954 },
  'Japan': { lat: 36.2048, lng: 138.2529 },
  'Australia': { lat: -25.2744, lng: 133.7751 },
  'Brazil': { lat: -14.2350, lng: -51.9253 },
  'South Korea': { lat: 35.9078, lng: 127.7669 },
  'Mexico': { lat: 23.6345, lng: -102.5528 },
  'Spain': { lat: 40.4637, lng: -3.7492 },
  'Italy': { lat: 41.8719, lng: 12.5674 },
  'Netherlands': { lat: 52.1326, lng: 5.2913 },
  'Sweden': { lat: 60.1282, lng: 18.6435 },
  'Switzerland': { lat: 46.8182, lng: 8.2275 },
  'Singapore': { lat: 1.3521, lng: 103.8198 },
  'UAE': { lat: 23.4241, lng: 53.8478 },
  'Russia': { lat: 61.5240, lng: 105.3188 },
};

export async function parseCSVData(filePath: string): Promise<AIAdoptionData[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(filePath, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        const data = results.data as AIAdoptionData[];
        resolve(data.filter(row => row.country && row.industry));
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

export function aggregateByCountry(data: AIAdoptionData[]): CountryData[] {
  const countryMap = new Map<string, { userValues: number[]; totalAdoption: number; count: number }>();

  data.forEach((row) => {
    const existing = countryMap.get(row.country) || { userValues: [], totalAdoption: 0, count: 0 };
    countryMap.set(row.country, {
      userValues: [...existing.userValues, row.daily_active_users],
      totalAdoption: existing.totalAdoption + row.adoption_rate,
      count: existing.count + 1,
    });
  });

  return Array.from(countryMap.entries()).map(([country, stats]) => ({
    country,
    totalUsers: calculateMedian(stats.userValues),
    averageAdoption: stats.totalAdoption / stats.count,
    count: stats.count,
    lat: countryCoordinates[country]?.lat || 0,
    lng: countryCoordinates[country]?.lng || 0,
  }));
}

export function aggregateByIndustry(data: AIAdoptionData[]): IndustryData[] {
  const industryMap = new Map<string, { userValues: number[]; totalAdoption: number; count: number }>();

  data.forEach((row) => {
    const existing = industryMap.get(row.industry) || { userValues: [], totalAdoption: 0, count: 0 };
    industryMap.set(row.industry, {
      userValues: [...existing.userValues, row.daily_active_users],
      totalAdoption: existing.totalAdoption + row.adoption_rate,
      count: existing.count + 1,
    });
  });

  return Array.from(industryMap.entries())
    .map(([industry, stats]) => ({
      industry,
      totalUsers: calculateMedian(stats.userValues),
      averageAdoption: stats.totalAdoption / stats.count,
      count: stats.count,
    }))
    .sort((a, b) => b.totalUsers - a.totalUsers);
}

export function aggregateByTool(data: AIAdoptionData[]): ToolData[] {
  const toolMap = new Map<string, { userValues: number[]; totalAdoption: number; count: number }>();

  data.forEach((row) => {
    const existing = toolMap.get(row.ai_tool) || { userValues: [], totalAdoption: 0, count: 0 };
    toolMap.set(row.ai_tool, {
      userValues: [...existing.userValues, row.daily_active_users],
      totalAdoption: existing.totalAdoption + row.adoption_rate,
      count: existing.count + 1,
    });
  });

  return Array.from(toolMap.entries())
    .map(([tool, stats]) => ({
      tool,
      totalUsers: calculateMedian(stats.userValues),
      averageAdoption: stats.totalAdoption / stats.count,
      count: stats.count,
    }))
    .sort((a, b) => b.totalUsers - a.totalUsers);
}

export function aggregateByYear(data: AIAdoptionData[]): TrendData[] {
  const yearMap = new Map<number, { totalAdoption: number; userValues: number[]; count: number }>();

  data.forEach((row) => {
    const existing = yearMap.get(row.year) || { totalAdoption: 0, userValues: [], count: 0 };
    yearMap.set(row.year, {
      totalAdoption: existing.totalAdoption + row.adoption_rate,
      userValues: [...existing.userValues, row.daily_active_users],
      count: existing.count + 1,
    });
  });

  return Array.from(yearMap.entries())
    .map(([year, stats]) => ({
      year,
      averageAdoption: stats.totalAdoption / stats.count,
      totalUsers: calculateMedian(stats.userValues),
    }))
    .sort((a, b) => a.year - b.year);
}

export function aggregateByAgeGroup(data: AIAdoptionData[]): AgeGroupData[] {
  const ageMap = new Map<string, { userValues: number[]; totalAdoption: number; count: number }>();

  data.forEach((row) => {
    const existing = ageMap.get(row.age_group) || { userValues: [], totalAdoption: 0, count: 0 };
    ageMap.set(row.age_group, {
      userValues: [...existing.userValues, row.daily_active_users],
      totalAdoption: existing.totalAdoption + row.adoption_rate,
      count: existing.count + 1,
    });
  });

  const ageOrder = ['18-24', '25-34', '35-44', '45-54', '55+'];

  return Array.from(ageMap.entries())
    .map(([ageGroup, stats]) => ({
      ageGroup,
      totalUsers: calculateMedian(stats.userValues),
      averageAdoption: stats.totalAdoption / stats.count,
    }))
    .sort((a, b) => ageOrder.indexOf(a.ageGroup) - ageOrder.indexOf(b.ageGroup));
}

export function aggregateByCompanySize(data: AIAdoptionData[]): CompanySizeData[] {
  const sizeMap = new Map<string, { userValues: number[]; totalAdoption: number; count: number }>();

  data.forEach((row) => {
    const existing = sizeMap.get(row.company_size) || { userValues: [], totalAdoption: 0, count: 0 };
    sizeMap.set(row.company_size, {
      userValues: [...existing.userValues, row.daily_active_users],
      totalAdoption: existing.totalAdoption + row.adoption_rate,
      count: existing.count + 1,
    });
  });

  const sizeOrder = ['Startup', 'SME', 'Enterprise'];

  return Array.from(sizeMap.entries())
    .map(([size, stats]) => ({
      size,
      totalUsers: calculateMedian(stats.userValues),
      averageAdoption: stats.totalAdoption / stats.count,
    }))
    .sort((a, b) => sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size));
}

export function calculateDashboardStats(data: AIAdoptionData[]): DashboardStats {
  // Sum of daily active users across all records
  const totalDailyActiveUsers = data.reduce((sum, row) => sum + row.daily_active_users, 0);
  const averageAdoption = data.reduce((sum, row) => sum + row.adoption_rate, 0) / data.length;
  const uniqueCountries = new Set(data.map(row => row.country)).size;
  const uniqueIndustries = new Set(data.map(row => row.industry)).size;

  const toolStats = aggregateByTool(data);
  const countryStats = aggregateByCountry(data);

  return {
    totalUsers: totalDailyActiveUsers,
    averageAdoption,
    totalCountries: uniqueCountries,
    totalIndustries: uniqueIndustries,
    topTool: toolStats[0]?.tool || 'N/A',
    topCountry: countryStats.sort((a, b) => b.totalUsers - a.totalUsers)[0]?.country || 'N/A',
  };
}

// New helper functions for working with precomputed data
export function getCountryDataForYear(
  precomputedData: PrecomputedData,
  year: number | null
): CountryData[] {
  if (!year) {
    return precomputedData.aggregations.byCountry;
  }

  // Filter raw data by year and recompute country aggregations
  const filteredData = precomputedData.rawData.filter(item => item.year === year);
  return aggregateByCountry(filteredData);
}

export function getIndustryDataForFilters(
  precomputedData: PrecomputedData,
  filters: { year?: number | null; country?: string | null }
): IndustryData[] {
  let filteredData = precomputedData.rawData;

  if (filters.year) {
    filteredData = filteredData.filter(item => item.year === filters.year);
  }

  if (filters.country) {
    filteredData = filteredData.filter(item => item.country === filters.country);
  }

  return aggregateByIndustry(filteredData);
}

export function getToolDataForFilters(
  precomputedData: PrecomputedData,
  filters: { year?: number | null; country?: string | null }
): ToolData[] {
  let filteredData = precomputedData.rawData;

  if (filters.year) {
    filteredData = filteredData.filter(item => item.year === filters.year);
  }

  if (filters.country) {
    filteredData = filteredData.filter(item => item.country === filters.country);
  }

  return aggregateByTool(filteredData);
}

export function getTrendDataForCountry(
  precomputedData: PrecomputedData,
  country: string | null
): TrendData[] {
  if (!country) {
    return precomputedData.aggregations.byYear;
  }

  const filteredData = precomputedData.rawData.filter(item => item.country === country);
  return aggregateByYear(filteredData);
}

export function getAgeGroupDataForFilters(
  precomputedData: PrecomputedData,
  filters: { year?: number | null; country?: string | null }
): AgeGroupData[] {
  let filteredData = precomputedData.rawData;

  if (filters.year) {
    filteredData = filteredData.filter(item => item.year === filters.year);
  }

  if (filters.country) {
    filteredData = filteredData.filter(item => item.country === filters.country);
  }

  return aggregateByAgeGroup(filteredData);
}

export function getCompanySizeDataForFilters(
  precomputedData: PrecomputedData,
  filters: { year?: number | null; country?: string | null }
): CompanySizeData[] {
  let filteredData = precomputedData.rawData;

  if (filters.year) {
    filteredData = filteredData.filter(item => item.year === filters.year);
  }

  if (filters.country) {
    filteredData = filteredData.filter(item => item.country === filters.country);
  }

  return aggregateByCompanySize(filteredData);
}
