// store/useScriptStore.ts
import { create } from "zustand";

interface ScriptState {
  script: string;
  setScript: (script: string) => void;
}

interface SelectedTextTimeState {
  selectedTextTime: number;
  setSelectedTextTime: (selectedTextTime: number) => void;
}

interface CurrentTimeState {
  currentTime: number;
  setCurrentTime: (time: number) => void;
}

interface DictionaryState {
  isDictionaryActive: boolean;
  setIsDictionaryActive: (isDictionaryActive: boolean) => void;
}

export const useScriptStore = create<ScriptState>((set) => ({
  script: "devanagari", // default script
  setScript: (script) => set({ script }),
}));

export const useSelectedTextTimeStore = create<SelectedTextTimeState>(
  (set) => ({
    selectedTextTime: 0, // default selectedTextTime
    setSelectedTextTime: (selectedTextTime) => set({ selectedTextTime }),
  })
);

export const useCurrentTimeStore = create<CurrentTimeState>((set) => ({
  currentTime: 0, // default currentTime
  setCurrentTime: (time) => set({ currentTime: time }),
}));

export const useDictionaryStore = create<DictionaryState>((set) => ({
  isDictionaryActive: false,
  setIsDictionaryActive: (isDictionaryActive) => set({ isDictionaryActive }),
}));
