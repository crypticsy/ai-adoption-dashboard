import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import type { AgeGroupData, CompanySizeData } from '../types';

interface DemographicsChartProps {
  ageData: AgeGroupData[];
  sizeData: CompanySizeData[];
}

export function DemographicsChart({ ageData, sizeData }: DemographicsChartProps) {
  const radarData = ageData.map(item => ({
    ageGroup: item.ageGroup,
    adoption: item.averageAdoption,
    dailyActiveUsers: item.totalUsers / 100000, // Scale down for visualization (in 100k)
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass rounded-2xl p-6 h-full"
    >
      <h3 className="text-xl font-bold text-white mb-2">Demographics Analysis</h3>
      <p className="text-white/60 text-sm mb-6">Age group adoption & daily active users</p>

      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="ageGroup" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
          <PolarRadiusAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '8px',
              color: '#fff',
            }}
            formatter={(value: any, name: string) => {
              if (name === 'Daily Active Users (100k)') {
                return [(value * 100000).toLocaleString(), name];
              }
              return [value, name];
            }}
          />
          <Radar
            name="Adoption Rate (%)"
            dataKey="adoption"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.6}
          />
          <Radar
            name="Daily Active Users (100k)"
            dataKey="dailyActiveUsers"
            stroke="#61afef"
            fill="#61afef"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>

      <div className="mt-6 space-y-3">
        <h4 className="text-white font-semibold text-sm mb-3">Company Size Distribution</h4>
        {sizeData.map((item, index) => {
          const maxUsers = Math.max(...sizeData.map(d => d.totalUsers));
          const percentage = (item.totalUsers / maxUsers) * 100;

          return (
            <motion.div
              key={item.size}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-white/80 text-sm">{item.size}</span>
                <span className="text-white/60 text-sm">{item.averageAdoption.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
