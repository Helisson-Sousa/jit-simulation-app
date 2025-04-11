import { create } from "zustand";

type SimulationParams = {
  estoque_inicial: number;
  estoque_seg_costura: number;
  tempo_simulacao: number;
  media_corte: number;
  std_corte: number;
  tempo_setup_corte: number;
  media_costura: number;
  std_costura: number;
  tempo_setup_costura: number;
};

type Store = {
  simulationParams: SimulationParams;
  setSimulationParams: (params: SimulationParams) => void;
};

export const useSimulationShoe = create<Store>((set) => ({
  simulationParams: {
    estoque_inicial: 95,
    estoque_seg_costura: 50,
    tempo_simulacao: 490,
    media_corte: 4.4,
    std_corte: 0.2,
    tempo_setup_corte: 0.3,
    media_costura: 4.5,
    std_costura: 0.3,
    tempo_setup_costura: 0.2,
  },
  setSimulationParams: (params) => set({ simulationParams: params }),
}));
