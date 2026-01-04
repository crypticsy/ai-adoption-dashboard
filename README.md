# AI Adoption Dashboard 🌍

A stunning, full-screen interactive globe visualization of global AI adoption data across industries, countries, and demographics. Experience data like never before with country polygons, smooth animations, and detailed analytics.

![Dashboard Preview](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178c6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.1-646cff?style=for-the-badge&logo=vite)

## ✨ Features

### 🌐 Full-Screen Globe Experience
- **3D Interactive Globe** - Beautifully rendered Earth with night imagery and starfield background
- **Country Polygons** - Countries are shown as actual 3D polygon shapes, not just points
- **Color-Coded Adoption** - Visual heat map showing AI adoption rates
  - 🟢 Green: 70%+ (High)
  - 🔵 Blue: 50-69% (Medium-High)
  - 🟠 Orange: 30-49% (Medium)
  - 🔴 Red: 0-29% (Low)
- **Auto-Rotation** - Globe smoothly rotates when no country is selected
- **Smooth Zoom** - Click any country to zoom in with cinematic camera movement

### ⏱️ Timeline Interface
- **Pudding.cool-Inspired Design** - Beautiful timeline slider at the top
- **Year-by-Year Exploration** - Filter data by year (2023-2024)
- **Auto-Play Mode** - Watch adoption trends evolve over time
- **Animated Progress Bar** - Visual indicator of selected time period

### 📊 Country Detail Panel
Clicking a country reveals a comprehensive analytics panel that slides in from the right:

- **Key Statistics** - Total users, adoption rate, industries, and AI tools
- **Adoption Trend** - Line chart showing year-over-year growth
- **Industry Breakdown** - Bar chart of top 5 industries
- **AI Tools Distribution** - Pie chart comparing ChatGPT, Midjourney, Bard, and Stable Diffusion
- **Company Size Analysis** - Visual breakdown by Startup, SME, and Enterprise

### 🎨 Design Excellence
- **Glassmorphism UI** - Modern frosted glass effects throughout
- **Smooth Animations** - Professional-grade animations using Framer Motion
- **Responsive Design** - Works beautifully on all screen sizes
- **Dark Theme** - Easy on the eyes with carefully chosen color palette
- **Gradient Accents** - Beautiful color gradients for visual hierarchy
- **Floating Stars** - Animated background elements for depth

## 🚀 Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Full type safety
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling with custom animations
- **Framer Motion** - Production-ready animation library
- **React Globe GL** - 3D globe visualization powered by Three.js
- **Recharts** - Beautiful, composable charts
- **D3.js** - Data manipulation and GeoJSON processing
- **Lucide React** - Clean, consistent icons
- **PapaParse** - Efficient CSV parsing

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Usage

1. **Explore the Globe** - The globe auto-rotates on load. Drag to manually rotate.
2. **Select Timeline** - Use the timeline at the top to filter by year or click play to animate through years
3. **Click Countries** - Click any colored country to view detailed analytics
4. **View Details** - The detail panel slides in from the right with charts and statistics
5. **Close Panel** - Click the X button or click another country to switch views

## 📊 Data

The dashboard visualizes **145,000+ data points** from `dataset/ai_adoption_dataset.csv`:

- **Countries**: 20+ nations tracked
- **Industries**: Technology, Healthcare, Finance, Education, Manufacturing, Retail, Agriculture, Transportation
- **AI Tools**: ChatGPT, Midjourney, Bard, Stable Diffusion
- **Company Sizes**: Startup, SME, Enterprise
- **Age Groups**: 18-24, 25-34, 35-44, 45-54, 55+
- **Years**: 2023-2024

## 🎨 Color Palette

```css
Primary Blues:   #3b82f6, #0ea5e9
Purples:        #8b5cf6, #ec4899
Success Green:  #10b981
Warning Orange: #f59e0b
Danger Red:     #ef4444
Dark Scheme:    #0f172a, #1e293b, #334155
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── GlobeVisualization.tsx   # Full-screen 3D globe
│   ├── TimelineSlider.tsx       # Year selection timeline
│   ├── CountryDetailPanel.tsx   # Sliding analytics panel
│   ├── StatCard.tsx             # Animated stat cards
│   ├── IndustryChart.tsx        # Industry visualizations
│   └── ...
├── hooks/
│   └── useDataLoader.ts         # Data loading hook
├── utils/
│   └── dataParser.ts            # CSV parsing and aggregation
├── types/
│   └── index.ts                 # TypeScript definitions
├── App.tsx                      # Main application
└── index.css                    # Global styles + Tailwind
```

## 🌟 Key Interactions

- **Hover** - See country details in tooltip
- **Click Country** - Open detailed analytics panel
- **Timeline Play** - Auto-cycle through years
- **Timeline Select** - Jump to specific year
- **Reset Button** - Clear all selections
- **Close Panel** - Exit country detail view

## 🔧 Configuration

Edit `tailwind.config.js` to customize:
- Color schemes
- Animation timings
- Spacing and sizing
- Custom utilities

## 📝 License

MIT

## 🙏 Credits

- Globe visualization powered by [globe.gl](https://github.com/vasturiano/globe.gl)
- Country boundaries from [Natural Earth](https://www.naturalearthdata.com/)
- Design inspiration from [The Pudding](https://pudding.cool/)
- Icons by [Lucide](https://lucide.dev/)

---

**Built with ❤️ using React, TypeScript, and Three.js**
