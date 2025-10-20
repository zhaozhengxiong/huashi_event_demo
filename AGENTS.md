# Repository Guidelines

## Project Structure & Module Organization
The Vite + React source lives under `src/` with entry `main.tsx` and root component `App.tsx`. Shared assets stay in `src/assets/`; global styles in `src/index.css` and component styles near usage. Static files served as-is belong in `public/`. Long-form notes or specs should go in `doc/` so they are easy to find.

## Build, Test, and Development Commands
Use `npm install` once to fetch dependencies. `npm run dev` launches the Vite dev server with HMR on localhost:5173. `npm run build` runs type-checking (`tsc -b`) and compiles production assets into `dist/`. `npm run preview` serves the built bundle for smoke testing. Run `npm run lint` before pushing to enforce ESLint rules.

## Coding Style & Naming Conventions
Stick to TypeScript + JSX with React function components. Follow 2-space indentation and single quotes as shown in `src/App.tsx`. Name components in PascalCase, hooks in camelCase, and CSS utilities in kebab-case. ESLint is configured in `eslint.config.js`; fix violations rather than suppressing them.

## Testing Guidelines
No automated tests ship yet; prefer Vitest with React Testing Library when adding coverage. Place unit specs in `src/__tests__/` or alongside components as `<Component>.test.tsx`. Keep tests deterministic and mirror the public API. Ensure `npm run build` stays green before marking work ready for review.

## Commit & Pull Request Guidelines
This export lacks Git history; use clear, present-tense commit titles (e.g., `Add match card layout`) with concise bodies describing user-facing changes. Group related changes per commit and keep noisy formatting in separate commits. Pull requests should describe motivation, list major code paths touched, and include manual or automated verification notes plus screenshots for UI updates.
