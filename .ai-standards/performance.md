# Performance

## React Optimization

### Memoization

```tsx
// Use React.memo for expensive components
export const UserCard = React.memo(({ user }: UserCardProps) => {
  return <div>{user.name}</div>;
});

// Use useMemo for expensive computations
const sortedUsers = useMemo(() => {
  return users.sort((a, b) => a.name.localeCompare(b.name));
}, [users]);

// Use useCallback for callback props
const handleEdit = useCallback((id: string) => {
  editUser(id);
}, [editUser]);
```

### Rendering

- Avoid inline functions in JSX props
- Lift state up only when necessary
- Use `React.lazy` for code splitting
- Virtualize long lists (react-window)

## Bundle Optimization

- Use dynamic imports for routes
- Configure Vite chunking in `vite.config.ts`
- Analyze bundle: `vite build --report`
- Remove unused MUI components (Tree shaking)

## Profiling

- Use React DevTools Profiler
- Measure: render time, commit time
- Identify: expensive components, unnecessary re-renders

## General Tips

- Debounce search inputs (300ms)
- Lazy load images below the fold
- Use CSS animations over JS animations
- Avoid synchronous heavy computations in render
