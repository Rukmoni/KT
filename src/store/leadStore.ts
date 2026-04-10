import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Lead {
  id: string;
  source: 'Chatbot' | 'Contact Form';
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  summary: string;
  fullTranscript: string;
  date: string;
}

interface LeadState {
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'date'>) => void;
  clearLeads: () => void;
}

export const useLeadStore = create<LeadState>()(
  persist(
    (set) => ({
      leads: [],
      addLead: (lead) => 
        set((state) => ({
          leads: [
            {
              ...lead,
              id: Math.random().toString(36).substr(2, 9),
              date: new Date().toLocaleString()
            },
            ...state.leads
          ]
        })),
      clearLeads: () => set({ leads: [] })
    }),
    {
      name: 'kuvanta-leads-storage' // Persisted in localStorage
    }
  )
);
