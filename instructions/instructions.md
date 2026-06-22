```markdown
# Project Instructions: Medication "Desert" Locator

You are an expert AI software agent and full-stack developer. Your task is to build the **Medication "Desert" Locator** (a geospatial SDoH optimization dashboard) by adhering strictly to the instructions, guardrails, and engineering standards outlined below.

---

# Step 1: Define the Project First

Before writing or modifying any application code, you **must** execute the following preparatory workflow:

1. Create a file in the root directory named `project_specs.md`.
2. Clearly define and document the following sections inside `project_specs.md`:
   * **User Inputs:** Exactly what inputs, parameters, and filter adjustments the user can provide.
   * **Workflows:** Step-by-step user and data processing journeys (e.g., loading map -> fetching SDoH metrics -> intersecting with pharmacy layers -> generating AI resource optimization plans).
   * **Tools & Technologies:** The exact tech stack choices (e.g., Vite, React, Tailwind CSS, Leaflet.js/Mapbox, Turf.js, Supabase, Gemini/OpenAI API).
   * **Expected Outputs:** Clear visualization formats, metrics cards, data grids, and exported/generated text layouts.
   * **Data Storage:** Where census tract data, infrastructure parameters, and manual user markers are stored.
   * **Deployment Vector:** Explicit confirmation of the deployment targets and baseline environments.
   * **Definition of "Done":** Explicit criteria that must be satisfied for the milestone to be considered fully complete and operational.
3. Present the compiled `project_specs.md` file layout to the user.
4. **STOP and wait for explicit user approval.** Do not write, scaffold, or generate any application codebase components before this file is formally approved.

---

# Universal Coding Standards

* **Strict TypeScript:** All code must be written in TypeScript. Absolutely avoid using the `any` type. Define strict interfaces, types, and schemas for all API responses, component props, spatial data shapes, and reactive state properties.
* **Modularity:** Keep your frontend layout elements small, single-purpose, and modular. Extract deep business logic, spatial processing algorithms, and asynchronous API calls into descriptive custom React hooks, keeping UI components focused purely on presentation.
* **Environment Security:** Never hardcode API keys, database connection strings, or system secrets. Always utilize a `.env` file for local development variables and provide an identical, clean `.env.example` file omitting the secret keys.
* **Incremental Development:** Do not attempt to construct or output the entire application architecture in a single, massive step. Build the foundational layout structures first, verify operational integrity, and add features sequentially using the 3-Tier maturity framework.
* **Graceful Error Handling:** Always design, implement, and mount descriptive loading state skeletons, interactive fallback panels, and strict React Error Boundaries. If a network endpoint or spatial processing loop fails, catch the error elegantly and show a fallback UI instead of crashing the interface.
* **Package Manager:** **ALWAYS use `pnpm`** (instead of `npm` or `yarn`) for all package installations, project instantiations (e.g., `pnpm create vite`), and script executions (`pnpm run dev`). Never call `npm`.

---

# Deployment Standards (GitHub Pages)

To ensure smooth automated builds and asset serving for Vite-based web applications targeted for GitHub Pages distribution, you must enforce the following rules:

## 1. Environment Configuration
* **Base Path:** In `vite.config.ts`, you **MUST** configure the `base` property to match the GitHub repository subfolder pattern. This ensures that assets (CSS, JS, and Images) are properly routed from the deployment directory.
```ts
export default defineConfig({
  base: '/YOUR-REPOSITORY-NAME/',
  // ... rest of config
})

```

## 2. Deployment Tooling

* **Package Installation:** Add `gh-pages` directly into your development dependencies workspace using `pnpm`:

```bash
pnpm add -D gh-pages

```

* **Script Integration:** Append the following lifecycle deployment commands into your project `package.json` file:

```json
"scripts": {
  "predeploy": "pnpm run build",
  "deploy": "gh-pages -d dist"
}

```

## 3. Launch Workflow

Execute this explicit 3-step sequence for every scheduled code deployment, but **get user confirmation and permission before pushing changes live**:

1. **Source Sync:** Commit and push all verified, local source code branches to your remote `main` branch.
2. **Execution:** Execute the command `pnpm run deploy` to compile the optimized production bundles into the `dist/` directory and force-push them to the remote `gh-pages` tracking branch.
3. **Activation:** Ensure that inside GitHub Settings > Pages, the deployment engine source is locked to track the automated `gh-pages` branch.

## 4. Troubleshooting Checklist

* **Clean Build Enforcement:** If production building fails, inspect the workspace for unreferenced imports, dead variables, or missing type descriptions. The internal `tsc` (TypeScript Compiler) will actively block compilation and deployment if strict parsing rules are violated.
* **Asset Loading Failures:** If the deployed environment returns a blank screen or a series of network 404 errors, immediately verify that the `base` key within `vite.config.ts` matches the destination repository name perfectly, complete with enclosing trailing slashes.

---

# Living Documentation (`explainer.md`)

You are required to maintain a comprehensive, living documentation file named `explainer.md` in the root of the project workspace.

As you build through each progressive tier of the application, you must incrementally update `explainer.md` to reflect:

1. **Core Domain Concepts:** Explanations of how Social Determinants of Health (SDoH) variables, Accessibility Gap Scores (AGS), and physical travel thresholds are being represented and computed within the product code.
2. **Architectural Blueprints:** Diagrams or detailed descriptions of the internal data engineering layout—such as how the application handles geospatial data layers, spatial intersections via Turf.js, and external analytical data transformations.
3. **API & Database Schemas:** Up-to-date type signatures, database schemas (including PostGIS or relational tables), and key external integrations used to power the application.

Keep this document clear, comprehensive, and production-ready so it can serve as an onboarding primer for any developer or stakeholder reviewing the product build.

```

```