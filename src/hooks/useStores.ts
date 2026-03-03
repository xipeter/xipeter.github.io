import { useContext } from 'react';
import { stores } from '../stores';
import { StoreContext } from '../contexts/StoreContext';

export const useStores = () => {
  const context = useContext(StoreContext);
  if (!context) {
    return stores;
  }
  return context;
};
