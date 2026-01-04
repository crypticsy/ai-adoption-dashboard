import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

interface YearFilterProps {
  years: number[];
  selectedYear: number | null;
  onYearChange: (year: number | null) => void;
}

export function YearFilter({ years, selectedYear, onYearChange }: YearFilterProps) {
  if (years.length === 0) return null;

  return (
    <motion.div
  initial={{ y: -20, opacity: 0, x: "-50%" }}
  animate={{ y: 0, opacity: 1, x: "-50%" }}
  transition={{ duration: 0.5 }}
  className="fixed top-6 left-1/2 z-40 pointer-events-none"
    >
      <div className="flex items-center justify-center gap-3 bg-[#1a1a1a]/90 border border-[#323437] rounded-lg px-6 py-3 shadow-2xl pointer-events-auto backdrop-blur-sm">
        <span className="text-[#abb2bf] font-medium text-sm">Global AI Adoption | </span>

        <Calendar className="text-[#e5c07b]" size={18} />
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onYearChange(null)}
            className={`px-4 py-1.5 rounded-md font-medium text-sm transition-all ${
              selectedYear === null
                ? 'bg-[#e5c07b] text-[#1a1a1a] shadow-lg shadow-[#e5c07b]/30'
                : 'text-[#abb2bf] hover:bg-[#323437]'
            }`}
          >
            All
          </motion.button>

          {years.map((year) => (
            <motion.button
              key={year}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onYearChange(year)}
              className={`px-4 py-1.5 rounded-md font-medium text-sm transition-all ${
                selectedYear === year
                  ? 'bg-[#e5c07b] text-[#1a1a1a] shadow-lg shadow-[#e5c07b]/30'
                  : 'text-[#abb2bf] hover:bg-[#323437]'
              }`}
            >
              {year}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
