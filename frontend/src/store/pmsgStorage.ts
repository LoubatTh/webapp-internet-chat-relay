import { create } from "zustand";
import { PmsgType } from "../lib/type";

type PmsgStorageState = {
  pmsgs: PmsgType[];
};

type PmsgStorageActions = {
  setPmsgs: (pmsgs: PmsgType[]) => void;
  addPmsg: (pmsg: PmsgType) => void;
  removePmsg: (pmsgId: string) => void;
};

const usePmsgStorageStore = create<
  PmsgStorageState & PmsgStorageActions 
>((set) => ({
  pmsgs: [],
  setPmsgs: (pmsgs: PmsgType[]) => set({ pmsgs }),
  addPmsg: (pmsg: PmsgType) =>
    set((state) => ({ pmsgs: [...state.pmsgs, pmsg] })),
  removePmsg: (pmsgId: string) =>
    set((state) => ({
      pmsgs: state.pmsgs.filter((pmsg) => pmsg._id !== pmsgId),
    })),
}));

export default usePmsgStorageStore;

