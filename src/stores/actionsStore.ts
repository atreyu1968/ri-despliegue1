import { create } from 'zustand';
import type { Action } from '../types/action';

interface ActionsState {
  actions: Action[];
  setActions: (actions: Action[]) => void;
  addAction: (action: Omit<Action, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAction: (id: string, action: Omit<Action, 'id' | 'createdAt' | 'updatedAt'>) => void;
  deleteAction: (id: string) => void;
}

export const useActionsStore = create<ActionsState>((set) => ({
  actions: [],
  setActions: (actions) => set({ actions }),
  addAction: (actionData) => set((state) => ({
    actions: [...state.actions, {
      ...actionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }],
  })),
  updateAction: (id, actionData) => set((state) => ({
    actions: state.actions.map((action) =>
      action.id === id
        ? {
            ...action,
            ...actionData,
            updatedAt: new Date().toISOString(),
          }
        : action
    ),
  })),
  deleteAction: (id) => set((state) => ({
    actions: state.actions.filter((action) => action.id !== id),
  })),
}));