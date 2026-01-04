import { useMemo, useState } from 'react';
import { useDataLoader } from './hooks/useDataLoader';
import { getCountryDataForYear } from './utils/dataParser';
import { GlobeVisualization } from './components/GlobeVisualization';
import { YearFilter } from './components/YearFilter';
import { CountryDetailPanel } from './components/CountryDetailPanel';
import type { CountryData } from './types';
import { motion } from 'framer-motion';

function App() {
  const { data, precomputedData, loading, error } = useDataLoader();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);

  const filteredData = useMemo(() => {
    if (!selectedYear) return data;
    return data.filter(item => item.year === selectedYear);
  }, [data, selectedYear]);

  const countryData = useMemo(() => {
    if (!precomputedData) return [];
    return getCountryDataForYear(precomputedData, selectedYear);
  }, [precomputedData, selectedYear]);

  const availableYears = useMemo(() => {
    return precomputedData?.availableYears || [];
  }, [precomputedData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="w-16 h-16 border-4 border-[#323437] border-t-[#e5c07b] rounded-full mx-auto mb-4"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-[#abb2bf] text-lg"
          >
            Loading global AI adoption data...
          </motion.p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1a1a1a] border border-[#323437] p-8 rounded-lg text-center max-w-md"
        >
          <div className="w-16 h-16 bg-[#e06c75]/20 border border-[#e06c75] rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-[#e06c75] text-4xl">!</span>
          </div>
          <h2 className="text-2xl font-bold text-[#e06c75] mb-2">Error Loading Data</h2>
          <p className="text-[#abb2bf]">{error}</p>
          <p className="text-[#5c6370] text-sm mt-4">Please check the console for more details.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0d0d0d]">
      {/* Year Filter at top */}
      <YearFilter
        years={availableYears}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />

      {/* Full-screen Globe */}
      <GlobeVisualization
        data={countryData}
        selectedCountry={selectedCountry}
        onCountrySelect={setSelectedCountry}
      />

      {/* Country Detail Panel (slides in from right when country selected) */}
      {selectedCountry && (
        <CountryDetailPanel
          country={selectedCountry}
          allData={data}
          selectedYear={selectedYear}
          onClose={() => setSelectedCountry(null)}
        />
      )}

      {/* Stats and Attribution */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="fixed bottom-4 right-4 z-20 text-right"
      >
        <div className="pointer-events-none space-y-3">
          <p className="text-[#5c6370] text-xs">
            Created by {' '}
            <a
              href="https://www.animeshbasnet.com.np/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-amber-200 pointer-events-auto inline-flex items-center gap-2 transition-colors"
            >
              Crypticsy
              <img
                src="https://github.com/crypticsy.png"
                alt="Crypticsy GitHub Profile"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-black/20 hover:border-black/40 transition-colors"
              />
            </a>
          </p>

          <p className="text-[#5c6370] text-xs">
            Dataset:{' '}
            <a
              href="https://www.kaggle.com/datasets/tfisthis/global-ai-tool-adoption-across-industries/data"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5c6370] hover:text-amber-200 underline pointer-events-auto"
            >
              Global AI Tool Adoption Across Industries
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default App;
