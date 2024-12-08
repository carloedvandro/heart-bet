import { create } from 'zustand';

interface TemporaryBetState {
  combinations: number[];
  setCombinations: (combinations: number[]) => void;
  clearCombinations: () => void;
}

export const useTemporaryBetState = create<TemporaryBetState>()((set) => ({
  combinations: [],
  setCombinations: (combinations) => set({ combinations }),
  clearCombinations: () => set({ combinations: [] }),
}));