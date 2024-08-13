// store/useScriptStore.ts
import { create } from "zustand";

interface ScriptState {
  script: string;
  setScript: (script: string) => void;
}

export const useScriptStore = create<ScriptState>((set) => ({
  script: "devanagari", // default script
  setScript: (script) => set({ script }),
}));
