export type ChannelType = {
  _id: number;
  name: string;
  visibility: string;
  members: string[];
};

export type MessagesType = {
  _id: string;
  text: string | JSX.Element;
  channelId: string;
  author: string;
};

export type MessagesPostType = {
  text: string;
  channelId: string;
  author: string;
};

