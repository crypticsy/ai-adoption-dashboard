import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import type { IndustryData } from '../types';

interface IndustryChartProps {
  data: IndustryData[];
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#f97316'];

export function IndustryChart({ data }: IndustryChartProps) {
  // Calculate total users across all industries
  const totalUsers = data.reduce((sum, item) => sum + item.totalUsers, 0);

  const chartData = data.map(item => ({
    name: item.industry,
    users: totalUsers > 0 ? (item.totalUsers / totalUsers) * 100 : 0, // Percentage of total
    adoption: item.averageAdoption,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6 h-full"
    >
      <h3 className="text-xl font-bold text-white mb-6">Industry Breakdown</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="name"
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8' }}
            label={{ value: 'Users (% of Total)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.98)',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: '8px',
              padding: '12px',
            }}
            itemStyle={{
              color: '#ffffff',
            }}
            labelStyle={{
              color: '#e5c07b',
              fontWeight: '600',
            }}
            wrapperStyle={{
              outline: 'none',
            }}
            cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
            formatter={(value: number, name: string) => {
              if (name === 'users') return [`${value.toFixed(2)}%`, 'Users % of Total'];
              if (name === 'adoption') return [`${value.toFixed(1)}%`, 'Adoption'];
              return [value, name];
            }}
          />
          <Bar dataKey="users" radius={[8, 8, 0, 0]}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {data.slice(0, 4).map((item, index) => (
          <motion.div
            key={item.industry}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-2"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-white/80 text-sm">{item.industry}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
