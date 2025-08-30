import { create } from "zustand";

const useStore = create((set) => ({
  selectedSymbol: null,
  ticks: {},
  orders: [],
  setSymbol: (symbol) => set({ selectedSymbol: symbol }),
  setTick: (symbol, price) => set((state) => ({
    ticks: { ...state.ticks, [symbol]: price }
  })),
  setOrders: (orders) => set({ orders }),
}));

export default useStore;
