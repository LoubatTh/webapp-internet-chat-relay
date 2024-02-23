import { create } from "zustand";

type ChannelMessageDisplayState = {
  channelId: string;
};

type ChannelMessageDisplayActions = {
  setChannelId: (channelId: string) => void;
};

const useChannelMessageDisplayStore = create<
  ChannelMessageDisplayState & ChannelMessageDisplayActions
>((set) => ({
  channelId: "",
  setChannelId: (channelId: string) => set({ channelId }),
}));

export default useChannelMessageDisplayStore;