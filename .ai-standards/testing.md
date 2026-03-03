# Testing (Jest)

## Test Structure

```
tests/
├── components/
│   └── UserCard.test.tsx
├── stores/
│   └── UserStore.test.ts
├── hooks/
│   └── useUserData.test.ts
└── utils/
    └── formatDate.test.ts
```

## Unit Tests

```typescript
import { UserStore } from '@/stores/UserStore';

describe('UserStore', () => {
  let store: UserStore;

  beforeEach(() => {
    store = new UserStore();
  });

  describe('fetchUsers', () => {
    it('should set loading state while fetching', async () => {
      const promise = store.fetchUsers();
      expect(store.isLoading).toBe(true);
      await promise;
      expect(store.isLoading).toBe(false);
    });

    it('should handle errors', async () => {
      jest.spyOn(api, 'getUsers').mockRejectedValue(new Error('Network error'));
      await store.fetchUsers();
      expect(store.error).toBe('Network error');
    });
  });
});
```

## Component Tests

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { UserCard } from '@/components';

describe('UserCard', () => {
  it('should render user name', () => {
    render(<UserCard user={{ id: '1', name: 'John' }} />);
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('should call onEdit when edit button clicked', () => {
    const onEdit = jest.fn();
    render(<UserCard user={{ id: '1', name: 'John' }} onEdit={onEdit} />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledWith('1');
  });
});
```

## Best Practices

- Use `describe` blocks to group related tests
- Follow AAA pattern: Arrange, Act, Assert
- Use `jest.fn()` for mocks
- Test happy path + error cases
- Keep tests focused and independent
- Use `userEvent` over `fireEvent` when possible
