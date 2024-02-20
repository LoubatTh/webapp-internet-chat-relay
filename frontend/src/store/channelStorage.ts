import { create } from "zustand";
import { ChannelType } from "../lib/type";

type ChannelStorageState = {
  channels: ChannelType[];
};

type ChannelStorageActions = {
  setChannels: (channel: ChannelType[]) => void;
};

const useChannelStorageStore = create<
  ChannelStorageState & ChannelStorageActions
>((set) => ({
  channels: [],
  setChannels: (channels: ChannelType[]) =>
    set((state) => ({ ...state, channels })),
}));

export default useChannelStorageStore;
