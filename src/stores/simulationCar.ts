import { create } from "zustand";

type SimulationParams = {
  estoque_inicial: number;
  estoque_seg_flamagem: number;
  tempo_simulacao: number;
  media_injetora: number;
  std_injetora: number;
  tempo_setup_injetora: number;
  media_flamagem: number;
  std_flamagem: number;
  tempo_setup_flamagem: number;
  media_colagem: number;
  std_colagem: number;
  tempo_setup_colagem: number;
  media_acabamento: number;
};

type Store = {
  simulationParams: SimulationParams;
  setSimulationParams: (params: SimulationParams) => void;
};

export const useSimulationCar = create<Store>((set) => ({
  simulationParams: {
    estoque_inicial: 100,
    estoque_seg_flamagem: 50,
    tempo_simulacao: 28800,
    media_injetora: 44.08,
    std_injetora: 0.87,
    tempo_setup_injetora: 2.4,
    media_flamagem: 34.8,
    std_flamagem: 0.97,
    tempo_setup_flamagem: 3.84,
    media_colagem: 82.3,
    std_colagem: 1.1,
    tempo_setup_colagem: 3.06,
    media_acabamento: 50,
  },
  setSimulationParams: (params) => set({ simulationParams: params }),
}));
