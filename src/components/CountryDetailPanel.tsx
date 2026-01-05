import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, TrendingUp, Building2, Zap, BarChart3, PieChart } from 'lucide-react';
import { BarChart, Bar, PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import type { CountryData, AIAdoptionData } from '../types';

interface CountryDetailPanelProps {
  country: CountryData | null;
  allData: AIAdoptionData[];
  selectedYear: number | null;
  onClose: () => void;
}

const COLORS = ['#e5c07b', '#98c379', '#61afef', '#e06c75', '#c678dd'];

export function CountryDetailPanel({ country, allData, selectedYear, onClose }: CountryDetailPanelProps) {
  if (!country) return null;

  // Filter data for this specific country (and year if selected)
  const countryData = allData.filter(d => {
    const matchesCountry = d.country === country.country;
    const matchesYear = selectedYear === null || d.year === selectedYear;
    return matchesCountry && matchesYear;
  });

  console.log('Country Detail Panel:', {
    country: country.country,
    selectedYear,
    totalDataPoints: allData.length,
    filteredDataPoints: countryData.length,
    sampleData: countryData.slice(0, 3)
  });

  // Aggregate by industry
  const industryMap = new Map<string, { users: number; adoption: number; count: number }>();
  countryData.forEach(d => {
    const existing = industryMap.get(d.industry) || { users: 0, adoption: 0, count: 0 };
    industryMap.set(d.industry, {
      users: existing.users + d.daily_active_users,
      adoption: existing.adoption + d.adoption_rate,
      count: existing.count + 1,
    });
  });

  const totalIndustryUsers = Array.from(industryMap.values()).reduce((sum, data) => sum + data.users, 0);
  const industryData = Array.from(industryMap.entries())
    .map(([name, data]) => ({
      name,
      users: data.users,
      usersPercent: totalIndustryUsers > 0 ? (data.users / totalIndustryUsers) * 100 : 0,
      adoption: (data.adoption / data.count).toFixed(1),
    }))
    .sort((a, b) => b.users - a.users)
    .slice(0, 5);

  // Aggregate by AI tool
  const toolMap = new Map<string, number>();
  countryData.forEach(d => {
    toolMap.set(d.ai_tool, (toolMap.get(d.ai_tool) || 0) + d.daily_active_users);
  });

  const toolData = Array.from(toolMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Aggregate by year (only if no year filter is selected)
  const yearMap = new Map<number, { users: number; adoption: number; count: number }>();
  countryData.forEach(d => {
    const existing = yearMap.get(d.year) || { users: 0, adoption: 0, count: 0 };
    yearMap.set(d.year, {
      users: existing.users + d.daily_active_users,
      adoption: existing.adoption + d.adoption_rate,
      count: existing.count + 1,
    });
  });

  const trendData = Array.from(yearMap.entries())
    .map(([year, data]) => ({
      year,
      adoption: (data.adoption / data.count).toFixed(1),
      users: data.users,
    }))
    .sort((a, b) => a.year - b.year);

  // Aggregate by company size
  const sizeMap = new Map<string, number>();
  countryData.forEach(d => {
    sizeMap.set(d.company_size, (sizeMap.get(d.company_size) || 0) + d.daily_active_users);
  });

  const sizeData = Array.from(sizeMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => {
      const order = ['Startup', 'SME', 'Enterprise'];
      return order.indexOf(a.name) - order.indexOf(b.name);
    });

  // Aggregate by age group
  const ageMap = new Map<string, { users: number; adoption: number; count: number }>();
  countryData.forEach(d => {
    const existing = ageMap.get(d.age_group) || { users: 0, adoption: 0, count: 0 };
    ageMap.set(d.age_group, {
      users: existing.users + d.daily_active_users,
      adoption: existing.adoption + d.adoption_rate,
      count: existing.count + 1,
    });
  });

  const ageOrder = ['18-24', '25-34', '35-44', '45-54', '55+'];
  const totalAgeUsers = Array.from(ageMap.values()).reduce((sum, data) => sum + data.users, 0);
  const ageData = Array.from(ageMap.entries())
    .map(([name, data]) => ({
      name,
      users: data.users,
      usersPercent: totalAgeUsers > 0 ? (data.users / totalAgeUsers) * 100 : 0,
      adoption: (data.adoption / data.count).toFixed(1),
    }))
    .sort((a, b) => ageOrder.indexOf(a.name) - ageOrder.indexOf(b.name));

  // Calculate totals for this filtered data
  const totalUsers = countryData.reduce((sum, d) => sum + d.daily_active_users, 0);
  const avgAdoption = countryData.length > 0
    ? countryData.reduce((sum, d) => sum + d.adoption_rate, 0) / countryData.length
    : 0;

  // Calculate domains with 10% padding for charts
  const calculateDomain = (values: number[]) => {
    if (values.length === 0) return [0, 100];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    const padding = range * 0.1;
    return [min - padding, max + padding];
  };

  const trendDomain = calculateDomain(trendData.map(d => parseFloat(d.adoption)));
  const industryDomain = calculateDomain(industryData.map(d => d.usersPercent));
  const ageDomain = calculateDomain(ageData.map(d => d.usersPercent));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 w-full md:w-[500px] lg:w-[600px] bg-[#1a1a1a]/98 backdrop-blur-xl border-l border-[#323437] z-50 overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#1a1a1a]/98 backdrop-blur-xl border-b border-[#323437] p-4 sm:p-6 z-10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#e5c07b] mb-1 sm:mb-2 truncate">{country.country}</h2>
              <p className="text-[#abb2bf] text-xs sm:text-sm">
                {selectedYear ? `Data for ${selectedYear}` : 'All data'} • {countryData.length.toLocaleString()} records
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="bg-[#323437] hover:bg-[#e5c07b] hover:text-[#1a1a1a] text-[#abb2bf] p-2 rounded-lg transition-colors flex-shrink-0"
            >
              <X size={20} className="sm:w-6 sm:h-6" />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#323437]/30 border border-[#e5c07b]/20 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Users className="text-[#e5c07b]" size={20} />
                <span className="text-[#abb2bf] text-sm">Total Data Points</span>
              </div>
              <div className="text-2xl font-bold text-[#e5c07b]">
                {totalUsers.toLocaleString()}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#323437]/30 border border-[#98c379]/20 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="text-[#98c379]" size={20} />
                <span className="text-[#abb2bf] text-sm">Adoption Rate</span>
              </div>
              <div className="text-2xl font-bold text-[#98c379]">
                {avgAdoption.toFixed(1)}%
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#323437]/30 border border-[#61afef]/20 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="text-[#61afef]" size={20} />
                <span className="text-[#abb2bf] text-sm">Industries</span>
              </div>
              <div className="text-2xl font-bold text-[#61afef]">
                {industryMap.size}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#323437]/30 border border-[#c678dd]/20 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="text-[#c678dd]" size={20} />
                <span className="text-[#abb2bf] text-sm">AI Tools</span>
              </div>
              <div className="text-2xl font-bold text-[#c678dd]">
                {toolMap.size}
              </div>
            </motion.div>
          </div>

          {/* Trend Chart - only show if we have multiple years */}
          {trendData.length > 1 && !selectedYear && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-[#1a1a1a] border border-[#323437] rounded-lg p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="text-[#e5c07b]" size={20} />
                <h3 className="text-lg font-semibold text-[#e5c07b]">Adoption Trend</h3>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#323437" />
                  <XAxis dataKey="year" stroke="#abb2bf" tick={{ fill: '#abb2bf' }} />
                  <YAxis stroke="#abb2bf" tick={{ fill: '#abb2bf' }} domain={trendDomain} tickFormatter={(value) => `${value.toFixed(0)}%`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #323437',
                      borderRadius: '8px',
                      color: '#abb2bf',
                    }}
                  />
                  <Line type="monotone" dataKey="adoption" stroke="#e5c07b" strokeWidth={2} dot={{ fill: '#e5c07b' }} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Industry Breakdown */}
          {industryData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-[#1a1a1a] border border-[#323437] rounded-lg p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="text-[#e5c07b]" size={20} />
                <h3 className="text-lg font-semibold text-[#e5c07b]">Top Industries</h3>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={industryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#323437" />
                  <XAxis dataKey="name" stroke="#abb2bf" tick={{ fill: '#abb2bf', fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="#abb2bf" tick={{ fill: '#abb2bf' }} label={{ value: 'Users %', angle: -90, position: 'insideLeft', fill: '#abb2bf' }} domain={industryDomain} tickFormatter={(value) => `${value.toFixed(0)}%`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #323437',
                      borderRadius: '8px',
                      color: '#abb2bf',
                    }}
                    itemStyle={{
                      color: '#ffffff',
                    }}
                    labelStyle={{
                      color: '#e5c07b',
                      fontWeight: '600',
                    }}
                    formatter={(value: number, name: string) => {
                      if (name === 'usersPercent') return [`${value.toFixed(2)}%`, 'Users % of Total'];
                      return [value, name];
                    }}
                  />
                  <Bar dataKey="usersPercent" radius={[8, 8, 0, 0]}>
                    {industryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* AI Tools Distribution */}
          {toolData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-[#1a1a1a] border border-[#323437] rounded-lg p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="text-[#e5c07b]" size={20} />
                <h3 className="text-lg font-semibold text-[#e5c07b]">AI Tools Distribution</h3>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <RechartsPie>
                  <Pie
                    data={toolData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {toolData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #323437',
                      borderRadius: '8px',
                      color: '#abb2bf',
                    }}
                    itemStyle={{
                      color: '#ffffff',
                    }}
                    labelStyle={{
                      color: '#e5c07b',
                      fontWeight: '600',
                    }}
                  />
                </RechartsPie>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Company Size Breakdown */}
          {sizeData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-[#1a1a1a] border border-[#323437] rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-[#e5c07b] mb-4">Company Size Distribution</h3>
              <div className="space-y-3">
                {sizeData.map((item, index) => {
                  const total = sizeData.reduce((sum, d) => sum + d.value, 0);
                  const percentage = (item.value / total) * 100;

                  return (
                    <div key={item.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[#abb2bf] text-sm font-medium">{item.name}</span>
                        <span className="text-[#5c6370] text-sm">{percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-[#323437] rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="h-full bg-[#e5c07b]"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 0.9 + index * 0.1 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Age Group Analytics */}
          {ageData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-[#1a1a1a] border border-[#323437] rounded-lg p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Users className="text-[#e5c07b]" size={20} />
                <h3 className="text-lg font-semibold text-[#e5c07b]">Age Group Analytics</h3>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#323437" />
                  <XAxis dataKey="name" stroke="#abb2bf" tick={{ fill: '#abb2bf' }} />
                  <YAxis stroke="#abb2bf" tick={{ fill: '#abb2bf' }} label={{ value: 'Users %', angle: -90, position: 'insideLeft', fill: '#abb2bf' }} domain={ageDomain} tickFormatter={(value) => `${value.toFixed(0)}%`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #323437',
                      borderRadius: '8px',
                      color: '#abb2bf',
                    }}
                    formatter={(value: number, name: string) => {
                      if (name === 'usersPercent') return [`${value.toFixed(2)}%`, 'Users % of Total'];
                      return [value, name];
                    }}
                  />
                  <Bar dataKey="usersPercent" fill="#61afef" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {ageData.map(item => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <span className="text-[#abb2bf]">{item.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[#61afef] font-semibold">{item.users.toLocaleString()} users</span>
                      <span className="text-[#98c379]">{item.adoption}% adoption</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
