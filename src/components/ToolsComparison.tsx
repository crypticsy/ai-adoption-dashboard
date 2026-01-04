import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import type { ToolData } from '../types';

interface ToolsComparisonProps {
  data: ToolData[];
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

export function ToolsComparison({ data }: ToolsComparisonProps) {
  const chartData = data.map(item => ({
    name: item.tool,
    value: item.totalUsers,
    adoption: item.averageAdoption,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass rounded-2xl p-6 h-full"
    >
      <h3 className="text-xl font-bold text-white mb-6">AI Tools Distribution</h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={1000}
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
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
            formatter={(value: number) => value.toLocaleString()}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-6 space-y-3">
        {data.map((tool, index) => (
          <motion.div
            key={tool.tool}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-white font-medium">{tool.tool}</span>
            </div>
            <div className="text-right">
              <div className="text-white font-semibold">{tool.totalUsers.toLocaleString()} users</div>
              <div className="text-white/60 text-sm">{tool.averageAdoption.toFixed(1)}% adoption</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
