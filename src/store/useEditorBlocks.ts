import { create } from "zustand";

export type Block = {
  id: string;
  type: "text" | "cta" | "faq" | "image";
  content?: string;
};

type Store = {
  blocks: Block[];
  addSection: (blocks: Block[]) => void;
  addBlock: (block: Block) => void;
  removeBlock: (id: string) => void;
  updateBlock: (id: string, content: string) => void;
  moveBlockUp: (id: string) => void;
  moveBlockDown: (id: string) => void;
  moveBlock: (fromIndex: number, toIndex: number) => void;
};

const getSavedBlocks = (): Block[] => {
  if (typeof window === "undefined") return [];

  const saved = localStorage.getItem("clyraweb-blocks");

  try {
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveBlocks = (blocks: Block[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("clyraweb-blocks", JSON.stringify(blocks));
  }
};

export const useEditorBlocks = create<Store>((set) => ({
  blocks: getSavedBlocks(),

  addBlock: (block) =>

    set((state) => {
      const updated = [...state.blocks, block];
      saveBlocks(updated);
      return { blocks: updated };
    }),
  addSection: (newBlocks) =>
    set((state) => {
      const updated = [...state.blocks, ...newBlocks];
      saveBlocks(updated);
      return { blocks: updated };
    }),
  removeBlock: (id) =>
    set((state) => {
      const updated = state.blocks.filter((b) => b.id !== id);
      saveBlocks(updated);
      return { blocks: updated };
    }),

  updateBlock: (id, content) =>
    set((state) => {
      const updated = state.blocks.map((b) =>
        b.id === id ? { ...b, content } : b
      );
      saveBlocks(updated);
      return { blocks: updated };
    }),

  moveBlockUp: (id) =>
    set((state) => {
      const updated = [...state.blocks];
      const index = updated.findIndex((b) => b.id === id);

      if (index > 0) {
        [updated[index - 1], updated[index]] = [
          updated[index],
          updated[index - 1],
        ];
      }

      saveBlocks(updated);
      return { blocks: updated };
    }),

  moveBlockDown: (id) =>
    set((state) => {
      const updated = [...state.blocks];
      const index = updated.findIndex((b) => b.id === id);

      if (index < updated.length - 1 && index !== -1) {
        [updated[index + 1], updated[index]] = [
          updated[index],
          updated[index + 1],
        ];
      }

      saveBlocks(updated);
      return { blocks: updated };
    }),

  // 🔥 New future-proof reorder function
  moveBlock: (fromIndex, toIndex) =>
    set((state) => {
      const updated = [...state.blocks];

      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= updated.length ||
        toIndex >= updated.length
      ) {
        return state;
      }

      const [movedBlock] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, movedBlock);

      saveBlocks(updated);
      return { blocks: updated };
    }),
}));