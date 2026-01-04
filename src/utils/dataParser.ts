import Papa from 'papaparse';
import type { AIAdoptionData, CountryData, IndustryData, ToolData, TrendData, AgeGroupData, CompanySizeData, DashboardStats } from '../types';

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
  const countryMap = new Map<string, { totalUsers: number; totalAdoption: number; count: number }>();

  data.forEach((row) => {
    const existing = countryMap.get(row.country) || { totalUsers: 0, totalAdoption: 0, count: 0 };
    countryMap.set(row.country, {
      totalUsers: existing.totalUsers + row.daily_active_users,
      totalAdoption: existing.totalAdoption + row.adoption_rate,
      count: existing.count + 1,
    });
  });

  return Array.from(countryMap.entries()).map(([country, stats]) => ({
    country,
    totalUsers: stats.totalUsers,
    averageAdoption: stats.totalAdoption / stats.count,
    count: stats.count,
    lat: countryCoordinates[country]?.lat || 0,
    lng: countryCoordinates[country]?.lng || 0,
  }));
}

export function aggregateByIndustry(data: AIAdoptionData[]): IndustryData[] {
  const industryMap = new Map<string, { totalUsers: number; totalAdoption: number; count: number }>();

  data.forEach((row) => {
    const existing = industryMap.get(row.industry) || { totalUsers: 0, totalAdoption: 0, count: 0 };
    industryMap.set(row.industry, {
      totalUsers: existing.totalUsers + row.daily_active_users,
      totalAdoption: existing.totalAdoption + row.adoption_rate,
      count: existing.count + 1,
    });
  });

  return Array.from(industryMap.entries())
    .map(([industry, stats]) => ({
      industry,
      totalUsers: stats.totalUsers,
      averageAdoption: stats.totalAdoption / stats.count,
      count: stats.count,
    }))
    .sort((a, b) => b.totalUsers - a.totalUsers);
}

export function aggregateByTool(data: AIAdoptionData[]): ToolData[] {
  const toolMap = new Map<string, { totalUsers: number; totalAdoption: number; count: number }>();

  data.forEach((row) => {
    const existing = toolMap.get(row.ai_tool) || { totalUsers: 0, totalAdoption: 0, count: 0 };
    toolMap.set(row.ai_tool, {
      totalUsers: existing.totalUsers + row.daily_active_users,
      totalAdoption: existing.totalAdoption + row.adoption_rate,
      count: existing.count + 1,
    });
  });

  return Array.from(toolMap.entries())
    .map(([tool, stats]) => ({
      tool,
      totalUsers: stats.totalUsers,
      averageAdoption: stats.totalAdoption / stats.count,
      count: stats.count,
    }))
    .sort((a, b) => b.totalUsers - a.totalUsers);
}

export function aggregateByYear(data: AIAdoptionData[]): TrendData[] {
  const yearMap = new Map<number, { totalAdoption: number; totalUsers: number; count: number }>();

  data.forEach((row) => {
    const existing = yearMap.get(row.year) || { totalAdoption: 0, totalUsers: 0, count: 0 };
    yearMap.set(row.year, {
      totalAdoption: existing.totalAdoption + row.adoption_rate,
      totalUsers: existing.totalUsers + row.daily_active_users,
      count: existing.count + 1,
    });
  });

  return Array.from(yearMap.entries())
    .map(([year, stats]) => ({
      year,
      averageAdoption: stats.totalAdoption / stats.count,
      totalUsers: stats.totalUsers,
    }))
    .sort((a, b) => a.year - b.year);
}

export function aggregateByAgeGroup(data: AIAdoptionData[]): AgeGroupData[] {
  const ageMap = new Map<string, { totalUsers: number; totalAdoption: number; count: number }>();

  data.forEach((row) => {
    const existing = ageMap.get(row.age_group) || { totalUsers: 0, totalAdoption: 0, count: 0 };
    ageMap.set(row.age_group, {
      totalUsers: existing.totalUsers + row.daily_active_users,
      totalAdoption: existing.totalAdoption + row.adoption_rate,
      count: existing.count + 1,
    });
  });

  const ageOrder = ['18-24', '25-34', '35-44', '45-54', '55+'];

  return Array.from(ageMap.entries())
    .map(([ageGroup, stats]) => ({
      ageGroup,
      totalUsers: stats.totalUsers,
      averageAdoption: stats.totalAdoption / stats.count,
    }))
    .sort((a, b) => ageOrder.indexOf(a.ageGroup) - ageOrder.indexOf(b.ageGroup));
}

export function aggregateByCompanySize(data: AIAdoptionData[]): CompanySizeData[] {
  const sizeMap = new Map<string, { totalUsers: number; totalAdoption: number; count: number }>();

  data.forEach((row) => {
    const existing = sizeMap.get(row.company_size) || { totalUsers: 0, totalAdoption: 0, count: 0 };
    sizeMap.set(row.company_size, {
      totalUsers: existing.totalUsers + row.daily_active_users,
      totalAdoption: existing.totalAdoption + row.adoption_rate,
      count: existing.count + 1,
    });
  });

  const sizeOrder = ['Startup', 'SME', 'Enterprise'];

  return Array.from(sizeMap.entries())
    .map(([size, stats]) => ({
      size,
      totalUsers: stats.totalUsers,
      averageAdoption: stats.totalAdoption / stats.count,
    }))
    .sort((a, b) => sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size));
}

export function calculateDashboardStats(data: AIAdoptionData[]): DashboardStats {
  const totalUsers = data.reduce((sum, row) => sum + row.daily_active_users, 0);
  const averageAdoption = data.reduce((sum, row) => sum + row.adoption_rate, 0) / data.length;
  const uniqueCountries = new Set(data.map(row => row.country)).size;
  const uniqueIndustries = new Set(data.map(row => row.industry)).size;

  const toolStats = aggregateByTool(data);
  const countryStats = aggregateByCountry(data);

  return {
    totalUsers,
    averageAdoption,
    totalCountries: uniqueCountries,
    totalIndustries: uniqueIndustries,
    topTool: toolStats[0]?.tool || 'N/A',
    topCountry: countryStats.sort((a, b) => b.totalUsers - a.totalUsers)[0]?.country || 'N/A',
  };
}
