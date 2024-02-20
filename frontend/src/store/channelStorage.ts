import { create } from "zustand";
import { ChannelType } from "../lib/type";

type ChannelStorageState = {
  channels: ChannelType[];
};

type ChannelStorageActions = {
  setChannels: (channels: ChannelType[]) => void;
  addChannel: (channel: ChannelType) => void;
  removeChannel: (channelId: string) => void;
  updateChannel: (
    channelId: string,
    newChannelData: Partial<ChannelType>
  ) => void;
};

const useChannelStorageStore = create<
  ChannelStorageState & ChannelStorageActions
>((set) => ({
  channels: [],
  setChannels: (channels: ChannelType[]) => set({ channels }),
  addChannel: (channel: ChannelType) =>
    set((state) => ({ channels: [...state.channels, channel] })),
  removeChannel: (channelId: string) =>
    set((state) => ({
      channels: state.channels.filter((channel) => channel._id !== channelId),
    })),
  updateChannel: (channelId: string, newChannelData: Partial<ChannelType>) =>
    set((state) => ({
      channels: state.channels.map((channel: ChannelType) =>
        channel._id === channelId ? { ...channel, ...newChannelData } : channel
      ),
    })),
}));

export default useChannelStorageStore;
