# State Management (MobX)

## Store Structure

```typescript
import { makeAutoObservable, runInAction } from 'mobx';

class UserStore {
  users: User[] = [];
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchUsers() {
    this.isLoading = true;
    this.error = null;
    
    try {
      const users = await api.getUsers();
      runInAction(() => {
        this.users = users;
      });
    } catch (e) {
      runInAction(() => {
        this.error = e.message;
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  get activeUsers() {
    return this.users.filter(u => u.isActive);
  }
}

export const userStore = new UserStore();
```

## Store Organization

- **Root Store**: Combine all stores in a root context
- **Store Hooks**: Use `useStores()` hook to access stores
- **Separation**: One store per domain (UserStore, AuthStore, UIStore)

## Best Practices

- Use `makeAutoObservable` for simplicity
- Always wrap async state updates in `runInAction`
- Use computed values (`get`) for derived state
- Keep stores focused — don't bloat one store
- Use `action` / `runInAction` for state mutations
- **No class components** — stores are the only classes in the codebase

## React Integration

```tsx
import { observer } from 'mobx-react-lite';
import { useStores } from '@/stores';

const UserList = observer(() => {
  const { userStore } = useStores();
  
  if (userStore.isLoading) return <Spinner />;
  
  return userStore.users.map(user => <UserCard key={user.id} user={user} />);
});
```
