import create from "zustand";

type SidePanelState = {
  openSidePanel: boolean;
};

type SidePanelActions = {
  setOpenSidePanel: (open: boolean) => void;
};

const useSidePanelStore = create<SidePanelState & SidePanelActions>((set) => ({
  openSidePanel: false,
  setOpenSidePanel: (open: boolean) => set({ openSidePanel: open }),
}));

export default useSidePanelStore;
