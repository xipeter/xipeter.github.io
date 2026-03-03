# Code Style

## TypeScript

- **Always use explicit types** for function parameters and return values
- Use `interface` for object shapes, `type` for unions/aliases
- Avoid `any`, use `unknown` when type is truly unknown
- Enable `strict: true` in tsconfig.json

## Naming Conventions

- **Files**: kebab-case (`user-profile.tsx`)
- **Components**: PascalCase (`UserProfile.tsx`)
- **Variables/functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Interfaces**: PascalCase, prefix with `I` only when ambiguous

## Import Order

```typescript
// 1. React/core
import { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';

// 2. MobX
import { observer } from 'mobx-react-lite';

// 3. External libraries (lodash, date-fns, etc.)
import { debounce, cloneDeep } from 'lodash';
import { format } from 'date-fns';

// 4. Internal modules
import { useStores } from '@/stores';
import { UserCard } from '@/components';

// 5. Types
import type { User } from '@/types';

// 6. Assets/utils
import { formatDate } from '@/utils';
```

## Lodash Usage

- Prefer native ES6 (e.g., `Array.map`, `Array.filter`) over lodash when possible
- Use lodash for complex operations: `debounce`, `throttle`, `cloneDeep`, `merge`, `get`, `set`
- Import specific functions: `import { debounce } from 'lodash'` (not `import _ from 'lodash'`)

## MUI Patterns

- Use MUI's `sx` prop for custom styles
- Follow MUI's component API (slots, slotProps)
- Use `ThemeProvider` for custom themes
- Leverage MUI's built-in breakpoints

## Formatting

- Use 2 spaces for indentation
- Single quotes for strings
- Trailing commas everywhere
- Maximum line length: 100 characters
