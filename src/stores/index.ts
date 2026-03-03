import { fileStore } from './FileStore';

export const stores = {
  fileStore,
};

export type RootStore = typeof stores;
