import create from "zustand";

type ChannelMessageDisplayState = {
  channelId: number;
};

type ChannelMessageDisplayActions = {
  setChannelId: (channelId: number) => void;
};

const useChannelMessageDisplayStore = create<
  ChannelMessageDisplayState & ChannelMessageDisplayActions
>((set) => ({
  channelId: 0,
  setChannelId: (channelId: number) => set({ channelId }),
}));

export default useChannelMessageDisplayStore;
