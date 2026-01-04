import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import type { TrendData } from '../types';

interface TrendChartProps {
  data: TrendData[];
}

export function TrendChart({ data }: TrendChartProps) {
  // Calculate total users across all years
  const totalUsers = data.reduce((sum, item) => sum + item.totalUsers, 0);

  const chartData = data.map(item => ({
    year: item.year.toString(),
    adoption: item.averageAdoption,
    users: totalUsers > 0 ? (item.totalUsers / totalUsers) * 100 : 0, // Percentage of total
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass rounded-2xl p-6 h-full"
    >
      <h3 className="text-xl font-bold text-white mb-2">Adoption Trends Over Time</h3>
      <p className="text-white/60 text-sm mb-6">Year-over-year growth analysis</p>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorAdoption" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="year"
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8' }}
          />
          <YAxis
            yAxisId="left"
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8' }}
            label={{ value: 'Adoption Rate (%)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8' }}
            label={{ value: 'Users (%)', angle: 90, position: 'insideRight', fill: '#94a3b8' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '8px',
              color: '#fff',
            }}
            formatter={(value: number, name: string) => {
              if (name === 'adoption') return [`${value.toFixed(1)}%`, 'Adoption Rate'];
              if (name === 'users') return [`${value.toFixed(2)}%`, 'Users % of Total'];
              return [value, name];
            }}
          />
          <Legend
            wrapperStyle={{ color: '#94a3b8' }}
            formatter={(value) => {
              if (value === 'adoption') return 'Adoption Rate';
              if (value === 'users') return 'Users % of Total';
              return value;
            }}
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="adoption"
            stroke="#3b82f6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorAdoption)"
            animationDuration={1500}
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="users"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorUsers)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="text-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="text-blue-400 text-sm font-medium mb-1">Average Growth</div>
          <div className="text-white text-2xl font-bold">
            {data.length > 1 ? (
              ((data[data.length - 1].averageAdoption - data[0].averageAdoption) / data.length).toFixed(1)
            ) : (
              '0.0'
            )}%
          </div>
        </div>
        <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
          <div className="text-green-400 text-sm font-medium mb-1">User Growth</div>
          <div className="text-white text-2xl font-bold">
            {data.length > 1 ? (
              ((data[data.length - 1].totalUsers / data[0].totalUsers - 1) * 100).toFixed(0)
            ) : (
              '0'
            )}%
          </div>
        </div>
      </div>
    </motion.div>
  );
}
