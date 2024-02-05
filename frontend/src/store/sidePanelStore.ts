import create from "zustand";

type SidePanelState = {
  openSidePanel: boolean;
};

type SidePanelActions = {
  setOpenSidePanel: (open: boolean) => void;
};

const createSidePanelStore = (set: (state: SidePanelState) => void) => ({
  openSidePanel: false,
  setOpenSidePanel: (open: boolean) => set({ openSidePanel: open }),
});

const useSidePanelStore = create<SidePanelState & SidePanelActions>(
  createSidePanelStore
);

export default useSidePanelStore;
