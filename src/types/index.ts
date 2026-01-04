export interface AIAdoptionData {
  country: string;
  industry: string;
  ai_tool: string;
  adoption_rate: number;
  daily_active_users: number;
  year: number;
  user_feedback: string;
  age_group: string;
  company_size: string;
}

export interface CountryData {
  country: string;
  totalUsers: number;
  averageAdoption: number;
  lat: number;
  lng: number;
  count: number;
}

export interface IndustryData {
  industry: string;
  totalUsers: number;
  averageAdoption: number;
  count: number;
}

export interface ToolData {
  tool: string;
  totalUsers: number;
  averageAdoption: number;
  count: number;
}

export interface TrendData {
  year: number;
  averageAdoption: number;
  totalUsers: number;
}

export interface AgeGroupData {
  ageGroup: string;
  totalUsers: number;
  averageAdoption: number;
}

export interface CompanySizeData {
  size: string;
  totalUsers: number;
  averageAdoption: number;
}

export interface DashboardStats {
  totalUsers: number;
  averageAdoption: number;
  totalCountries: number;
  totalIndustries: number;
  topTool: string;
  topCountry: string;
}
