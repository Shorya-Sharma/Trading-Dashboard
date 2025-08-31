import { create } from 'zustand';

const useStore = create(set => ({
  selectedSymbol: null,
  setSymbol: symbol => set({ selectedSymbol: symbol }),
}));

export default useStore;
