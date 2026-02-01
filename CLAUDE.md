# Stablecoin Market Dashboard

React + TypeScript dashboard for stablecoin market data, regulation tracking, and insights. Deployed on Vercel.

## Quick Commands

```bash
npm run dev            # Local dev server (Vite)
npm run build          # TypeScript check + Vite build
npm run test:run       # Single test run (Vitest)
npm run test           # Watch mode tests
npm run lint           # ESLint
```

Build runs `tsc -b && vite build` — TypeScript errors will fail the build.

## Tech Stack

- **Framework**: React 19, TypeScript 5 (strict mode), Vite 7
- **Routing**: React Router DOM 7
- **Styling**: Tailwind CSS 4 with custom primary color palette
- **Charts**: Recharts 3 (AreaChart, PieChart, LineChart)
- **Maps**: React Simple Maps (world regulation map)
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library + MSW for API mocking
- **Deployment**: Vercel

## Architecture

```
src/
  api/           # Custom hooks for data fetching
  components/
    common/      # Reusable: Badge, Card, Skeleton, Spinner, etc.
    overview/    # Dashboard: KPI cards, charts, treasury, reserves
    canada/      # Canada regulation components
    countries/   # Global regulation components
    news/        # News display components
    layout/      # Header, Footer, PageContainer
  routes/        # Page components (OverviewPage, CanadaPage, etc.)
  types/         # Shared TypeScript interfaces
  utils/         # Formatting and calculation helpers
  config/        # API URLs, feature flags, cache durations
  data/          # Static datasets (Canadian stablecoins)
  test/          # Test setup (jsdom, matchMedia mock, ResizeObserver mock)
```

### API Hook Pattern

All API hooks return the same interface:

```typescript
{ data: T | null, isLoading: boolean, error: Error | null, refetch: () => void }
```

Hooks live in `src/api/` and are re-exported from `src/api/index.ts`.

### Component Conventions

- Feature folders under `src/components/` — colocated with their test files
- Shared components in `src/components/common/`
- Tailwind for all styling — no CSS modules or styled-components
- Recharts for all data visualization
- Loading states use `Skeleton*` components from common
- Error states include a retry button calling `refetch()`

## Data Sources

| Source | File | Type |
|--------|------|------|
| DefiLlama API | `src/api/marketApi.ts` | Live — market caps, charts, chain breakdown, stablecoin list |
| US Treasury TIC Data | `TreasuryHoldingsCard.tsx` | Static — Nov 2025 foreign holder rankings |
| Tether/Circle Attestations | `marketApi.ts` RESERVE_DATA | Static — treasury holdings ($135B/$62B) |
| Transaction KPIs | `TransactionKpiCard.tsx` | Static — Visa/Allium sourced metrics |

Static data needs manual updates. Sources and dates are documented in comments and card attribution links.

## Environment Variables

```
VITE_GTM_CONTAINER_ID          # Google Tag Manager
VITE_BEEHIIV_EMBED_URL         # Beehiiv newsletter signup form URL
```

See `.env.example` for the template.

## Workflow Rules

- **Plan first**: Enter plan mode for any task with 3+ steps or architectural decisions
- **Verify before done**: Run `npm run build` — TypeScript errors fail the build. Run tests when touching API hooks or utils
- **Simplicity first**: Make every change as simple as possible. Minimal code impact
- **No temporary fixes**: Find root causes. No workarounds that will need revisiting
- **Minimal impact**: Only touch what's necessary. Don't refactor adjacent code
- **Data consistency**: When the same metric appears in multiple cards (e.g. treasury holdings), ensure values match across all components
