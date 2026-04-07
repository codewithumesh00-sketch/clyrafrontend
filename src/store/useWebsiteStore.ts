import { create } from "zustand";

interface WebsiteState {
  website: any;
  setWebsite: (website: any) => void;
}

export const useWebsiteStore = create<WebsiteState>((set) => ({
  website: {},
  setWebsite: (website) => set({ website }),
}));