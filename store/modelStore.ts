import { create } from "zustand";

interface ModelState {
  model: string;
  setModel: (model: string) => void;
  thinkEnabled: boolean;
  setThinkEnabled: (value: boolean) => void;
  hasUsedNoThink: boolean;
  setHasUsedNoThink: (used: boolean) => void;
}

export const useModelStore = create<ModelState>((set) => ({
  model: "",
  setModel: (model) => set({ model }),

  //
  thinkEnabled: false,
  setThinkEnabled: (value) => set({ thinkEnabled: value }),
  hasUsedNoThink: false,
  setHasUsedNoThink: (used) => set({ hasUsedNoThink: used }),
}));
