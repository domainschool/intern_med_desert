# AegisMap: SDoH Medication Desert Locator

AegisMap is a geospatial Social Determinants of Health (SDoH) optimization dashboard designed to identify medication deserts and simulate mobile clinic outreach placements.

## 🚀 Key Features

* **SDoH Score Calculator**: Calculates Accessibility Gap Scores (AGS) based on poverty, vehicle-less, and elderly rates.
* **Geospatial Visualization**: Visualizes census tracts, existing pharmacies, and 15-minute travel buffers.
* **Mobile Clinic Simulation**: Place mobile clinics to cover deserts, reducing readmission penalties and calculating live financial savings (ROI).
* **AI Resource Planner**: Streams tailored clinical routes, operational budgets, and health worker scripts powered by Gemini.
* **Access Control Simulation**: Toggles between Field Operator and Regional Director permissions.

## 🛠️ Tech Stack

* React 18 & Vite
* TypeScript (Strict)
* Tailwind CSS
* Lucide React Icons
* pnpm Package Manager

## 📦 Getting Started

### 1. Installation
Clone the repository and install dependencies using `pnpm`:
```bash
pnpm install
```

### 2. Run Local Development Server
To launch the hot-reloading dev server:
```bash
pnpm run dev
```

### 3. Production Compilation & Type Checking
To compile static production bundles:
```bash
pnpm run build
```

### 4. Deploy to GitHub Pages
To compile and publish the build to GitHub Pages:
```bash
pnpm run deploy
```
*Note: Make sure `vite.config.ts` base path matches your repository subfolder name.*
