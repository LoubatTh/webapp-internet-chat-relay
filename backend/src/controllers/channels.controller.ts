import { Request, Response } from "express";
import { Channel, IChannel } from "../models/channels.model";
import { User } from "~/models/users.model";
import { Message } from "~/models/messages.model";

// GET /channels
// Get all channels
export const getChannels = async (req: Request, res: Response) => {
  try {
    const visibility = req.query.visibility as string;
    const channels =
      visibility && checkVisibility(visibility)
        ? await Channel.find({ visibility: visibility })
        : await Channel.find({ visibility: { $in: ["public", "private"] } });

    res.status(200).json(channels);
    return;
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /channels/:id
// Get a channel by id
export const getChannel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const channel = await Channel.findById(id);

    if (!channel) {
      res.status(404).json({ message: "Channel not found" });
      return;
    } else {
      res.status(200).json(channel);
      return;
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// POST /channels
// Create a new channel
export const createChannel = async (req: Request, res: Response) => {
  try {
    const { name, members, visibility, owner } = req.body;

    if (!name || name.length === 0 || typeof name !== "string") {
      res.status(400).json({ message: "Name is required" });
      return;
    }

    if (
      !visibility ||
      visibility.length === 0 ||
      typeof visibility !== "string"
    ) {
      res.status(400).json({ message: "Visibility is required" });
      return;
    } else if (checkVisibility(visibility) === false) {
      res.status(400).json({
        message: 'Visibility is "public" or "private" or "personnal"',
      });
      return;
    }

    if (!owner || owner.length === 0 || typeof owner !== "string") {
      res.status(400).json({ message: "Owner is required" });
      return;
    }

    const checkOwner = await User.findById(owner);

    if (!checkOwner) {
      res.status(404).json({ message: "Owner not found" });
      return;
    }

    let data = {
      name: name,
      visibility: visibility,
      owner: owner,
    } as IChannel;

    if (members && members.length > 0) {
      for (let i = 0; i < members.length; i++) {
        const member = await User.findById(members[i]);
        const guest = await Channel.findById(members[i]);

        if (!member && !guest) {
          res.status(404).json({ message: "Member not found" });
          return;
        }
      }

      data.members = members;
    } else {
      data.members = [];
    }

    const channel = new Channel(data);
    const savedChannel = await channel.save();

    for (let i = 0; i < savedChannel.members.length; i++) {
      const member = await User.findById(savedChannel.members[i]);
      const guest = await Channel.findById(savedChannel.members[i]);

      if (member && !guest) {
        member.channels.push(savedChannel._id.toString());
        await member.save();
      } else if (!member && guest) {
        guest.members.push(savedChannel._id.toString());
        await guest.save();
      }
    }

    res.status(201).json(savedChannel);
    return;
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /channels/:id
// Update a channel informations by id
export const updateChannel = async (req: Request, res: Response) => {
  interface IChannelUpdate {
    name: string;
    visibility: string;
  }

  try {
    const { id } = req.params;
    const { name, visibility, owner } = req.body;

    if (!checkOwner(id, owner)) {
      res
        .status(400)
        .json({ message: "You are not the owner of this channel" });
      return;
    }

    if (!name && !visibility) {
      res.status(400).json({ message: "At least one field is required" });
      return;
    }

    let data = {} as IChannelUpdate;

    if (name) {
      data.name = name;
    }

    if (visibility) {
      if (checkVisibility(visibility)) {
        data.visibility = visibility;
      } else {
        res
          .status(400)
          .json({
            message: 'Visibility is "public", "private" or "personnal"',
          });
        return;
      }
    }

    const channel = await Channel.findByIdAndUpdate(id, data, { new: true });

    if (!channel) {
      res.status(404).json({ message: "Channel not found" });
    }

    res.status(200).json(channel);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /channels/:id
// Delete a channel by id
export const deleteChannel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { owner } = req.body;

    if (!checkOwner(id, owner)) {
      res
        .status(400)
        .json({ message: "You are not the owner of this channel" });
    }

    const messages = await Message.find({ channelId: id });

    for (let i = 0; i < messages.length; i++) {
      const message = await Message.findByIdAndDelete(messages[i]._id);

      if (!message) {
        res.status(404).json({ message: "Message not found" });
        return;
      }
    }

    const channel = await Channel.findById(id);
    if (!channel) {
      res.status(404).json({ message: "Channel not found" });
      return;
    }

    for (let i = 0; i < channel.members.length; i++) {
      const member = await User.findById(channel.members[i]);
      const guest = await Channel.findById(channel.members[i]);

      if (member) {
        const memberIndex = member.channels.indexOf(id);
        if (memberIndex === -1) {
          res.status(404).json({ message: "Channel not found in member" });
          return;
        }

        member.channels.splice(memberIndex, 1);
        await member.save();
      } else if (guest) {
        const guestIndex = guest.members.indexOf(id);
        if (guestIndex === -1) {
          res.status(404).json({ message: "Channel not found in guest" });
          return;
        }

        guest.members.splice(guestIndex, 1);
        await guest.save();
      }
    }

    const deletedChannel = await Channel.findByIdAndDelete(id);
    if (!deletedChannel) {
      res.status(404).json({ message: "Channel not found" });
    } else {
      res.status(200).json({ message: "Channel deleted" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const checkVisibility = (visibility: string) => {
  if (
    visibility !== "public" &&
    visibility !== "private" &&
    visibility !== "personnal"
  ) {
    return false;
  }
  return true;
};

const checkOwner = async (server: string, owner: string) => {
  const check = await User.findById(owner);

  if (!check) {
    return false;
  }

  const checkServer = await Channel.findById(server);

  if (!checkServer) {
    return false;
  }

  if (checkServer.owner !== owner) {
    return false;
  }

  return true;
};
