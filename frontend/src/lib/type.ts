export type ChannelType = {
  _id: string;
  name: string;
  visibility: string;
  members: string[];
};

export type MessagesType = {
  _id: string;
  text: string | JSX.Element;
  channelId: string;
  authorId: string;
};

export type MessagesPostType = {
  text: string;
  channelId: string;
  authorId: string;
};

