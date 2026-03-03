# React Patterns

## Functional Components Only

**No class components** — use hooks exclusively.

```tsx
// ✅ Correct - Functional component
export const UserCard = observer(({ user, onEdit }: UserCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return (
    <Box>
      <Typography>{user.name}</Typography>
    </Box>
  );
});

// ❌ Wrong - Class component
class UserCard extends React.Component { ... }
```

## Component Structure

```tsx
// 1. Imports
import { useState, useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { debounce } from 'lodash';

// 2. Types
interface UserCardProps {
  user: User;
  onEdit?: (id: string) => void;
}

// 3. Component (functional + observer for MobX)
export const UserCard = observer(({ user, onEdit }: UserCardProps) => {
  // 4. Local state
  const [isExpanded, setIsExpanded] = useState(false);

  // 5. Callbacks
  const handleToggle = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  // 6. Render
  return (
    <Box>
      <Typography>{user.name}</Typography>
    </Box>
  );
});
```

## Hooks

- Extract reusable logic into custom hooks
- Prefix with `use` (e.g., `useUserData`, `useAuth`)
- Keep hooks focused and single-purpose

## MUI Integration

- Use `Box`, `Stack`, `Grid` for layout
- Use `Typography` for text
- Use `Button`, `TextField`, `Select` for form elements
- Leverage MUI's `sx` prop for custom styling

## Props

- Use explicit prop types/interfaces
- Make optional props explicit with `?`
- Provide default props for commonly omitted values

## Rendering

- Keep render logic simple
- Extract complex conditional rendering into sub-components
- Use `React.memo` for expensive components
