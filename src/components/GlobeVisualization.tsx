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

      // Point camera at selected country only when selecting (not when deselecting)
      if (selectedCountry) {
        globe.pointOfView(
          {
            lat: selectedCountry.lat,
            lng: selectedCountry.lng,
            altitude: 2.5
          },
          1000
        );
      }
      // When deselecting, don't move the camera - stay at current position
    }
  }, [selectedCountry]);

  const getCountryData = useCallback((country: any) => {
    const countryName = country.properties.NAME || country.properties.ADMIN;
    return data.find(d => d.country === countryName);
  }, [data]);

  const getCountryColor = useCallback((country: any) => {
    const countryData = getCountryData(country);
    if (!countryData) return 'rgba(50, 52, 55, 0.4)'; // Serika dark grey for no data

    // Highlight selected country with vibrant orange/gold
    const countryName = country.properties.NAME || country.properties.ADMIN;
    if (selectedCountry && countryName === selectedCountry.country) {
      return 'rgba(255, 255, 255, 1)'; // Vibrant white for selected (more distinct)
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
    return (countryData.averageAdoption / 100) * 0.01 + 0.01;
  }, [getCountryData, selectedCountry]);

  const handleCountryClick = useCallback((country: any) => {
    const countryData = getCountryData(country);
    if (countryData) {
      onCountrySelect(selectedCountry?.country === countryData.country ? null : countryData);
    }
  }, [getCountryData, onCountrySelect, selectedCountry]);

  return (
    <div className="fixed inset-0 w-full h-full bg-[#0d0d0d] globe-container">
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
            <div style="background: rgba(26, 26, 26, 0.95) !important; border: 1px solid rgba(50, 52, 55, 0.8); border-radius: 8px; padding: 12px; min-width: 200px; backdrop-filter: blur(8px); box-shadow: none !important;">
              <div style="font-weight: bold; color: #e5c07b; font-size: 16px; margin-bottom: 8px;">${countryData.country}</div>
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <div style="display: flex; justify-content: space-between; font-size: 12px;">
                  <span style="color: #abb2bf;">Adoption:</span>
                  <span style="color: #98c379; font-weight: 600;">${countryData.averageAdoption.toFixed(1)}%</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px;">
                  <span style="color: #abb2bf;">Avg. Daily Active Users:</span>
                  <span style="color: #61afef; font-weight: 600;">${countryData.totalUsers.toLocaleString()}</span>
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

        // Globe appearance - solid and opaque
        globeMaterial={{
          color: '#0d0d0d',
          emissive: '#0d0d0d',
          emissiveIntensity: 0.3,
          shininess: 0.2,
          opacity: 1,
          transparent: false,
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
            className="fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none px-4"
          >
            <div className="bg-[#1a1a1a] border border-[#323437] px-9 sm:px-4 py-2 sm:py-3 rounded-lg">
              <p className="text-[#abb2bf] text-xs text-center">
                <span className="hidden sm:inline">Click on a country to view detailed analytics</span>
                <span className="sm:hidden">Tap a country for details</span>
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
        className="fixed bottom-4 sm:bottom-12 left-3 sm:left-8 z-30 glass p-3 sm:p-4 rounded-lg text-xs sm:text-sm"
      >
        <h3 className="text-[#e5c07b] font-semibold text-xs sm:text-sm mb-2 sm:mb-3">Adoption Rate</h3>
        <div className="space-y-1.5 sm:space-y-2">
          {[
            { color: '#61afef', label: '70%+' },
            { color: '#98c379', label: '50-69%' },
            { color: '#e5c07b', label: '30-49%' },
            { color: '#e06c75', label: '0-29%' },
            { color: '#323437', label: 'No Data' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded flex-shrink-0" style={{ backgroundColor: item.color, opacity: 0.9 }} />
              <span className="text-[#abb2bf] text-xs whitespace-nowrap">{item.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
