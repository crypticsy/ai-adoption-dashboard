import { useEffect, useRef, useState, useCallback } from 'react';
import Globe from 'react-globe.gl';
import { motion, AnimatePresence } from 'framer-motion';
import type { CountryData } from '../types';

interface GlobeVisualizationProps {
  data: CountryData[];
  onCountrySelect: (country: CountryData | null) => void;
  selectedCountry: CountryData | null;
}

export function GlobeVisualization({ data, onCountrySelect, selectedCountry }: GlobeVisualizationProps) {
  const globeEl = useRef<any>();
  const [countries, setCountries] = useState<any>({ features: [] });
  const [_, setHoverD] = useState<any>(null);

  useEffect(() => {
    // Load country data
    fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(setCountries);
  }, []);

  useEffect(() => {
    if (globeEl.current) {
      const globe = globeEl.current;

      // Configure camera and controls
      globe.controls().autoRotate = !selectedCountry;
      globe.controls().autoRotateSpeed = 0.3;
      globe.controls().enableZoom = true;
      globe.controls().minDistance = 150;
      globe.controls().maxDistance = 400;

      // Point camera at selected country
      if (selectedCountry) {
        globe.pointOfView(
          {
            lat: selectedCountry.lat,
            lng: selectedCountry.lng,
            altitude: 2.5
          },
          1000
        );
      } else {
        // Reset to default view
        globe.pointOfView({ lat: 0, lng: 0, altitude: 2.5 }, 1000);
      }
    }
  }, [selectedCountry]);

  const getCountryData = useCallback((country: any) => {
    const countryName = country.properties.NAME || country.properties.ADMIN;
    return data.find(d => d.country === countryName);
  }, [data]);

  const getCountryColor = useCallback((country: any) => {
    const countryData = getCountryData(country);
    if (!countryData) return 'rgba(50, 52, 55, 0.4)'; // Serika dark grey for no data

    // Highlight selected country with bright gold
    const countryName = country.properties.NAME || country.properties.ADMIN;
    if (selectedCountry && countryName === selectedCountry.country) {
      return 'rgba(229, 192, 123, 1)'; // Bright gold for selected
    }

    const adoption = countryData.averageAdoption;

    // More distinct color scale for better visibility
    if (adoption >= 70) return 'rgba(97, 175, 239, 0.9)'; // bright blue (70%+)
    if (adoption >= 50) return 'rgba(152, 195, 121, 0.9)'; // success green (50-69%)
    if (adoption >= 30) return 'rgba(229, 192, 123, 0.9)'; // accent yellow (30-49%)
    return 'rgba(224, 108, 117, 0.9)'; // error red (0-29%)
  }, [getCountryData, selectedCountry]);

  const getCountryAltitude = useCallback((country: any) => {
    const countryData = getCountryData(country);
    if (!countryData) return 0.001;

    // Raise selected country higher
    const countryName = country.properties.NAME || country.properties.ADMIN;
    if (selectedCountry && countryName === selectedCountry.country) {
      return 0.08; // Higher altitude for selected country
    }

    // Scale altitude based on adoption rate (0.01 to 0.05)
    return (countryData.averageAdoption / 100) * 0.04 + 0.01;
  }, [getCountryData, selectedCountry]);

  const handleCountryClick = useCallback((country: any) => {
    const countryData = getCountryData(country);
    if (countryData) {
      onCountrySelect(selectedCountry?.country === countryData.country ? null : countryData);
    }
  }, [getCountryData, onCountrySelect, selectedCountry]);

  return (
    <div className="fixed inset-0 w-full h-full bg-[#0d0d0d]">
      {/* Globe */}
      <Globe
        ref={globeEl}
        backgroundColor="rgba(0,0,0,0)"

        // Polygon layer (countries)
        polygonsData={countries.features}
        polygonAltitude={getCountryAltitude}
        polygonCapColor={getCountryColor}
        polygonSideColor={() => 'rgba(0, 0, 0, 0.8)'}
        polygonStrokeColor={() => 'rgba(229, 192, 123, 0.2)'}
        polygonLabel={({ properties }: any) => {
          const countryName = properties.NAME || properties.ADMIN;
          const countryData = data.find(d => d.country === countryName);

          if (!countryData) return '';

          return `
            <div class="glass p-3 rounded-lg min-w-[200px]">
              <div class="font-bold text-[#e5c07b] text-base mb-2">${countryData.country}</div>
              <div class="space-y-1">
                <div class="flex justify-between text-xs">
                  <span class="text-[#abb2bf]">Adoption:</span>
                  <span class="text-[#98c379] font-semibold">${countryData.averageAdoption.toFixed(1)}%</span>
                </div>
                <div class="flex justify-between text-xs">
                  <span class="text-[#abb2bf]">Daily Active Users:</span>
                  <span class="text-[#61afef] font-semibold">${countryData.totalUsers.toLocaleString()}</span>
                </div>
              </div>
            </div>
          `;
        }}
        onPolygonClick={handleCountryClick}
        onPolygonHover={setHoverD}
        polygonsTransitionDuration={300}

        // Minimal atmosphere
        atmosphereColor="rgba(229, 192, 123, 0.3)"
        atmosphereAltitude={0.15}

        // Globe appearance
        globeMaterial={{
          color: '#1a1a1a',
          emissive: '#1a1a1a',
          emissiveIntensity: 0.2,
          shininess: 0.3,
          opacity: 1,
        }}

        // Animation
        animateIn={true}
        enablePointerInteraction={true}
      />

      {/* Instructions overlay */}
      <AnimatePresence>
        {!selectedCountry && (
          <motion.div
            initial={{ opacity: 0, y: 20 , x: '-50%'}}
            animate={{ opacity: 1, y: 0 , x: '-50%'}}
            exit={{ opacity: 0, y: -20 , x: '-50%'}}
            transition={{ delay: 1 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
          >
            <div className="bg-[#1a1a1a] border border-[#323437] px-6 py-3 rounded-lg">
              <p className="text-[#abb2bf] text-sm">
                Click on a country to view detailed analytics
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5 }}
        className="fixed bottom-8 left-8 z-30 glass p-4 rounded-lg"
      >
        <h3 className="text-[#e5c07b] font-semibold text-sm mb-3">Adoption Rate</h3>
        <div className="space-y-2">
          {[
            { color: '#61afef', label: '70%+' },
            { color: '#98c379', label: '50-69%' },
            { color: '#e5c07b', label: '30-49%' },
            { color: '#e06c75', label: '0-29%' },
            { color: '#323437', label: 'No Data' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color, opacity: 0.9 }} />
              <span className="text-[#abb2bf] text-xs">{item.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
