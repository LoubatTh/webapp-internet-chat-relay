import { Channel } from "~/models/channels.model";
import { Guest } from "~/models/guests.model";
import { Pmsg } from "~/models/pmsgs.model";
import { User } from "~/models/users.model";

export const isChannelMember = async (channelId: string, authorId: string) => {
  const channel = await Channel.findById(channelId);
  const pmsg = await Pmsg.findById(channelId);
  const user = await User.findById(authorId);
  const guest = await Guest.findById(authorId);

  if (channel) {
    return user
      ? channel.members.includes(user._id.toString())
      : guest
      ? channel.members.includes(guest._id.toString())
      : false;
  } else if (pmsg) {
    return user
      ? pmsg.members.includes(user._id.toString())
      : guest
      ? pmsg.members.includes(guest._id.toString())
      : false;
  }

  return false;
};
