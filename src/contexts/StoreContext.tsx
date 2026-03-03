import { createContext } from 'react';
import { stores } from '../stores';

export const StoreContext = createContext(stores);

interface StoreProviderProps {
  children: React.ReactNode;
}

export const StoreProvider = ({ children }: StoreProviderProps): React.JSX.Element => {
  return (
    <StoreContext.Provider value={stores}>
      {children}
    </StoreContext.Provider>
  );
};
