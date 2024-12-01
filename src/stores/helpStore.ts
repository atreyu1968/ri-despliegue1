import { create } from 'zustand';
import type { HelpSection, HelpContent } from '../types/help';

interface HelpState {
  sections: HelpSection[];
  setSections: (sections: HelpSection[]) => void;
  addSection: (section: Omit<HelpSection, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSection: (id: string, section: Partial<HelpSection>) => void;
  deleteSection: (id: string) => void;
  getSection: (id: string) => HelpSection | undefined;
  getChildSections: (parentId?: string) => HelpSection[];
}

export const useHelpStore = create<HelpState>((set, get) => ({
  sections: [],
  
  setSections: (sections) => set({ sections }),
  
  addSection: (sectionData) => {
    const section: HelpSection = {
      ...sectionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    set(state => ({
      sections: [...state.sections, section]
    }));
  },
  
  updateSection: (id, sectionData) => {
    set(state => ({
      sections: state.sections.map(section =>
        section.id === id
          ? {
              ...section,
              ...sectionData,
              updatedAt: new Date().toISOString(),
            }
          : section
      ),
    }));
  },
  
  deleteSection: (id) => {
    set(state => ({
      sections: state.sections.filter(section => section.id !== id),
    }));
  },
  
  getSection: (id) => {
    return get().sections.find(section => section.id === id);
  },
  
  getChildSections: (parentId) => {
    return get().sections
      .filter(section => section.parentId === parentId)
      .sort((a, b) => a.order - b.order);
  },
}));