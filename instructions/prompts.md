## Tier 1: MVP 1 (Zero-Config, Mock Data & Core UI Logic)

### Prompt 1.1: Project Scaffolding & Theme Setup

```text
Act as an expert Frontend Engineer. Build the initial layout and theme for a "Medication Desert Locator" application using React, Tailwind CSS, and Lucide React icons. 

Create a split-screen dashboard design layout:
1. Left Panel (1/3 width): A sidebar containing a product header ("AegisMap: SDoH Optimization"), KPI summary cards for "High-Risk Tracts Identified", "Estimated Preventable Readmissions Cost Saved", and "Active Mobile Routes", followed by an interactive filter panel (sliders for Poverty Rate, No Vehicle Availability, and Age 65+).
2. Right Panel (2/3 width): A clean mockup placeholder container for our map interface. For now, render an SVG or styled CSS grid pretending to be a stylized tactical map with a dark, modern dashboard aesthetic.

Implement a unified, highly professional Dark Mode theme using Slate/Zinc neutrals as the background, Emerald/Teal accents for active infrastructure elements, and Amber/Rose for high-accessibility-gap indicators. Ensure all components are modular, responsive, and render immediately with zero-config required. Use local state for the filter sliders.

```

### Prompt 1.2: Mock Spatial GeoJSON & Pharmacy Arrays

```text
We need to wire up the dashboard with comprehensive local mock data arrays to test our visual layers without hitting external networks. Append a structured data file or internal state array containing:
1. An array of 10 'Census Tracts' objects. Each tract must have: ID, Name (e.g., "Tract 402.01"), Population, Poverty Rate (%), No-Vehicle Rate (%), Elderly Rate (%), and a center coordinate offset (X, Y percentage mapping for our visual container).
2. An array of 4 'Existing Pharmacies' objects with names (e.g., "Community Care Pharmacy", "County Health Rx") and explicit layout coordinates.

Write a frontend calculation engine using React `useMemo` that processes these arrays. Calculate a localized Accessibility Gap Score (AGS) for each tract using the formula: AGS = (Poverty * 0.4) + (NoVehicle * 0.4) + (Elderly * 0.2). If a tract's coordinate is far from all pharmacy coordinates, multiply its score by an additional 'Distance Friction Penalty' factor of 1.5. Output the calculated tracts into a data grid table directly underneath our map container.

```

### Prompt 1.3: Interactive Visual Canvas & Tract Selection State

```text
Replace the static map placeholder container on the right side with an interactive SVG/HTML5 absolute canvas container. 
1. Render the 10 mock Census Tracts as interactive HTML/SVG bounding blocks or circles placed dynamically based on their mock spatial coordinates.
2. Color-code each tract block based on its calculated Accessibility Gap Score (AGS) using a step-color gradient scale: Low Risk (<30) = Green, Medium Risk (30-60) = Orange, High Risk (>60) = Red.
3. Render the 4 existing pharmacies as distinct, bright glowing teal cross icons overlaid on top of the tracts.
4. Implement interactive hover states and an onClick handler on each tract block. Clicking a tract must populate a 'Selected Tract Detail Card' at the top of the sidebar, displaying its exact demographic breakdown, estimated uncompensated readmission risk penalty ($ value), and a prominent action button labeled "Simulate Resource Allocation".

```

---

## Tier 2: MVP 2 (Live Asynchronous APIs, Isochrones & LLM Routing Insights)

### Prompt 2.1: Live Geospatial Leaflet Engine Integration

```text
We are graduating from mock UI coordinates to real-world spatial physics. Integrate `react-leaflet` and `leaflet` into the map container panel. Set the initial map view to center over a known real-world vulnerable region (e.g., Detroit, Michigan or rural Appalachian county coordinates). 

Write an asynchronous `useEffect` data fetching routine that loads a live public GeoJSON file containing real census tracts (or use a public API endpoint) along with a mock fetch mimicking the HIFLD Pharmacy point locations dataset. Replace the SVG canvas layout with real Leaflet TileLayers and GeoJSON polygon vectors. Ensure the polygons are dynamically colored using an inline choropleth styling function keyed to your calculated SDoH accessibility gaps. Add a loading state skeleton animation spinner overlaying the map while the asynchronous data components settle.

```

### Prompt 2.2: True Routing Isochrones & Proximity Intersects

```text
Upgrade the distance logic from straight-line approximations to true pedestrian walking/driving friction using spatial mathematics. Integrate `turf` (or native geographic bounding box calculation methods). 

Write an asynchronous network function that simulates calling a routing matrix or Isochrone API. For each point in our pharmacy layer, generate or load a 15-minute geographic travel boundary ring polygon. Write a client-side spatial intersection processing routine that evaluates whether the center point (centroid) of each real Census Tract polygon sits inside *any* pharmacy's 15-minute travel polygon. If a tract falls entirely outside all pharmacy travel boundaries, flag its metadata attribute `is_desert: true`. Update the frontend dashboard metrics cards to dynamically count and display the absolute number of residents living within these strict `is_desert` boundaries.

```

### Prompt 2.3: AI Deployment Architect (Gemini/OpenAI Integration)

```text
Integrate an interactive, automated LLM diagnostic panel into the dashboard sidebar utilizing modern edge runtime handling. When a user clicks the "Generate Deployment Optimization Plan" button, gather the current state data of the top 3 highest-risk medication desert tracts (including their exact population, poverty levels, lack of vehicles, and calculated accessibility gap scores).

Construct a structured JSON payload prompt and securely dispatch it to an LLM provider endpoint using environment variables (`process.env.VITE_AI_API_KEY`). Prompt the model to act as an expert Healthcare Enterprise Product Consultant and output a structured operational response:
1. A recommended distribution route for 1 mobile health clinic.
2. An estimated monthly operational cost budget calculation.
3. A highly tailored outreach script for community health workers.

Stream or transition this text response cleanly inside a typewriter-style animation container block inside a new tab in the sidebar named "AI Resource Planner".

```

---

## Tier 3: Scaling for Enterprises (Persistence, Analytics, Security & Production Polish)

### Prompt 3.1: Supabase/PostgreSQL Data Pipeline & State Hydration

```text
Transition the application state from local runtime volatility to an enterprise-grade backend infrastructure layer using Supabase (PostgreSQL with PostGIS extensions logic). 

1. Write a complete SQL database schema initialization script to execute in Supabase. Create a `census_tracts` table, a `pharmacies` table, and a `mobile_deployments` tracking table. Ensure columns utilize optimal indexing rules for rapid retrieval.
2. Replace all local initial state variables with standard asynchronous async/await client calls to fetch live data directly from your Supabase tables.
3. Implement an interactive workflow feature where a user can click on the map to manually place a new "Proposed Mobile Health Clinic Checkpoint". Write a database write mutation that automatically saves this point coordinate, along with a timestamp and user ID metadata payload, into the `mobile_deployments` database table, maintaining instant optimistic UI state reactivity.

```

### Prompt 3.2: Enterprise Access Controls & Secure Route Guards

```text
Implement robust enterprise authorization architecture patterns to ensure compliance with strict health administrative standards. Configure a secure routing layout framework (such as React Router Dom or Next.js middleware guards). 

Create two distinct application workspace user profiles:
1. "Field Operator": Can only view accessibility heatmaps, see scheduled mobile clinic routes, and input deployment tracking updates.
2. "Regional Director": Has complete access to sensitive financial penalty tracking statistics, write access to allocate new community budgets, and administrative permission to modify weighting criteria sliders.

Wrap the primary analytics panels inside secure authentication checks. If an unauthenticated user attempts to access administrative components, redirect them to a polished enterprise login portal screen with error boundary alerts.

```

### Prompt 3.3: Production Analytics Dashboards, Recharts Integration & Dark Toggle

```text
Elevate the product to a enterprise-ready application by embedding a robust performance visualization framework and system-wide design consistency:
1. Integrate `recharts` inside the lower analytical dashboard interface. Render a dual-axis composite chart: a Bar Chart displaying the absolute number of high-risk elderly residents per tract, overlaid with a Line Chart plotting the corresponding calculated Accessibility Gap Score. 
2. Add a beautifully animated horizontal horizontal bar chart showing a financial projection breakdown of "Penalties Avoided vs. Cost of Mobile Clinic Deployment" across 6 months.
3. Implement a flawless system-wide Dark/Light theme toggle switcher utilizing Tailwind CSS configuration strategies (`darkMode: 'class'`). Ensure all components, borders, charts, maps, and sidebar text transitions perfectly between crisp high-contrast professional daytime layout standards and deep slate nighttime monitoring modes without visual clipping or state resets.

```