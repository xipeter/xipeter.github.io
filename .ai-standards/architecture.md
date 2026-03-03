# Architecture

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── common/        # Generic components (Button, Input, etc.)
│   └── features/      # Feature-specific components
├── pages/             # Route-level components
├── stores/            # MobX stores
├── services/          # API clients, utilities
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
├── utils/             # Helper functions (lodash wrappers)
├── constants/         # App constants, config
└── assets/            # Static assets
```

## Component Guidelines

- **Functional components only** — no class components
- **Presentational components**: Pure UI, no MobX state
- **Container components**: Connect to stores, handle data fetching
- **Feature folders**: Group by feature when complex

## State Management

- MobX for global state
- React local state (`useState`, `useReducer`) for component-specific UI state
- URL params for navigation state

## Dependencies

- **React** — UI engine (functional components + hooks)
- **MobX** — State management
- **Material UI (MUI)** — Component library
- **lodash** — Utility functions (use es6 equivalents when possible)
