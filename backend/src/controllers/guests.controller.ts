import { Request, Response } from "express";
import { Guest, IGuest } from "../models/guests.model";
import { User } from "../models/users.model";
import { Channel } from "~/models/channels.model";
import { Pmsg } from "~/models/pmsgs.model";
import { IMessage, Message } from "~/models/messages.model";

// GET /guests
// Get all guests
export const getGuests = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;

    if (name) {
      const guests = await Guest.findOne({ username: name });

      if (!guests) {
        res.status(404).json({ message: "Guest not found" });
        return;
      }

      res.status(200).json(guests);
      return;
    } else {
      const guests = await Guest.find();
      res.status(200).json(guests);
      return;
    }
  } catch (error: any) {
    res.status(500).json(error.message);
    return;
  }
};

// GET /guests/:id
// Get a guest
export const getGuest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const guest = await Guest.findById(id);

    if (!guest) {
      res.status(404).json({ message: "Guest not found" });
      return;
    }

    res.status(200).json(guest);
    return;
  } catch (error: any) {
    res.status(500).json(error.message);
    return;
  }
};

// POST /guests
// Add a guest
export const createGuest = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;

    if (!username) {
      res.status(400).json({ message: "Missing field" });
      return;
    }

    const checkGuestname = await Guest.findOne({ guestname: username });

    if (checkGuestname) {
      res.status(400).json({ message: "Guestname already taken" });
      return;
    }

    const checkUsername = await User.findOne({ username: username });

    if (checkUsername) {
      res.status(400).json({ message: "Guestname already taken" });
      return;
    }

    const data: IGuest = {
      username: username,
      channels: [],
      pmsgs: [],
      lastConnexion: new Date(),
    };

    const guest = new Guest(data);
    const savedGuest = await guest.save();

    res.status(201).json(savedGuest);
    return;
  } catch (error: any) {
    res.status(500).json(error.message);
    return;
  }
};

// PUT /guests/:id
// Update a user informations
export const updateGuest = async (req: Request, res: Response) => {
  interface IGuestUpdate {
    username: string;
  }

  try {
    const { id } = req.params;
    const { username, informations } = req.body;
    const oldUsername = await Guest.findById(id).then((oldGuest) => {
      return oldGuest ? oldGuest.username : "";
    });

    console.log(oldUsername);

    if (!username && !informations) {
      res.status(400).json({ message: "Missing field" });
      return;
    }

    const data = {} as IGuestUpdate;

    if (username) {
      const checkUsername = await User.findOne({ username: username });
      const checkGuest = await Guest.findOne({ username: username });

      if (checkUsername || checkGuest) {
        res.status(400).json({ message: "Username already taken" });
        return;
      }

      data.username = username;
    }

    const guest = await Guest.findByIdAndUpdate(id, data, { new: true });

    if (!guest) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(guest);
    return;
  } catch (error: any) {
    res.status(500).json(error.message);
    return;
  }
};

// DELETE /guests/:id
// Delete a guest
export const deleteGuest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const guest = await Guest.findByIdAndDelete(id);

    if (!guest) {
      res.status(404).json({ message: "Guest not found" });
      return;
    }

    for (let i = 0; i < guest.channels.length; i++) {
      const channel = await Channel.findById(guest.channels[i]);

      if (!channel) {
        res.status(404).json({ message: "Channel not found" });
        return;
      }

      const channelIndex = channel.members.indexOf(id);

      if (channelIndex === -1) {
        res.status(404).json({ message: "Guest not found in channel" });
        return;
      }

      channel.members.splice(channelIndex, 1);
      await channel.save();
    }

    res.status(200).json({ message: "Guest deleted" });
    return;
  } catch (error: any) {
    res.status(500).json(error.message);
    return;
  }
};

// GET /guests/:id/channels
// Get all guest's channels
export const getGuestChannels = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const guest = await Guest.findById(id, "channels");
    const visibility = req.query.visibility as string;
    let channels = [];

    if (!guest) {
      res.status(404).json({ message: "Guest not found" });
      return;
    }

    for (let i = 0; i < guest.channels.length; i++) {
      const channel = await Channel.findById(guest.channels[i]);

      if (!channel) {
        res.status(404).json({ message: "Channel not found" });
        return;
      }

      if (visibility && visibility === channel.visibility) {
        channels.push(channel);
      } else if (
        (!visibility && channel.visibility === "public") ||
        channel.visibility === "private"
      ) {
        channels.push(channel);
      }
    }

    res.status(200).json(channels);
    return;
  } catch (error: any) {
    res.status(500).json(error.message);
    return;
  }
};

// POST /guests/:id/channels
// Add a channel to guest's channels
export const addGuestChannel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { channelId } = req.body;

    if (!channelId) {
      res.status(400).json({ message: "Missing field" });
      return;
    }

    const guest = await Guest.findById(id);

    if (!guest) {
      res.status(404).json({ message: "Guest not found" });
      return;
    }

    const channel = await Channel.findById(channelId);

    if (!channel) {
      res.status(404).json({ message: "Channel not found" });
      return;
    }

    for (let i = 0; i < guest.channels.length; i++) {
      if (channelId === guest.channels[i]) {
        res.status(400).json({ message: "channel already joined" });
        return;
      }
    }

    let data: IMessage = {
      text: `${guest.username} vient d'arriver dans le channel. Bienvenu(e) !`,
      channelId: channelId,
      authorId: "65db5d8c1dc68d78ca5801d4",
      createdAt: new Date(),
    };

    const message = new Message(data);
    await message.save();

    guest.channels.push(channelId);
    channel.members.push(id);
    const savedGuest = await guest.save();
    const savedChannel = await channel.save();

    res.status(200).json({ guest: savedGuest, channel: savedChannel });
    return;
  } catch (error: any) {
    res.status(500).json(error.message);
    return;
  }
};

// DELETE /guests/:id/channels/:channelId
// Remove a channel from guest's channels
export const removeGuestChannel = async (req: Request, res: Response) => {
  try {
    const { id, channelId } = req.params;
    const guest = await Guest.findById(id);

    if (!guest) {
      res.status(404).json({ message: "Guest not found" });
      return;
    }

    const channel = await Channel.findById(channelId);

    if (!channel) {
      res.status(404).json({ message: "Channel not found" });
      return;
    }

    const guestIndex = guest.channels.indexOf(channelId);

    if (guestIndex === -1) {
      res.status(404).json({ message: "Channel not found in guest" });
      return;
    }

    const channelIndex = channel.members.indexOf(id);

    if (channelIndex === -1) {
      res.status(404).json({ message: "Guest not found in channel" });
      return;
    }
    
    let data: IMessage = {
      text: `${guest.username} vient de quitter le channel. :(`,
      channelId: channelId,
      authorId: "65db5d8c1dc68d78ca5801d4",
      createdAt: new Date(),
    };

    const message = new Message(data);
    await message.save();

    guest.channels.splice(guestIndex, 1);
    channel.members.splice(channelIndex, 1);
    const savedGuest = await guest.save();
    const savedChannel = await channel.save();

    res.status(200).json({ guest: savedGuest, channel: savedChannel });
    return;
  } catch (error: any) {
    res.status(500).json(error.message);
    return;
  }
};

// GET /users/:id/pmsg
// Get user private messages
export const getUserPmsgs = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const guest = await Guest.findById(id, "pmsgs");
    let pmsgs = [];

    if (!guest) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    for (let i = 0; i < guest.pmsgs.length; i++) {
      const pmsg = await Pmsg.findById(guest.pmsgs[i]);

      if (!pmsg) {
        res.status(404).json({ message: "Channel not found" });
        return;
      }

      pmsgs.push(pmsg);
    }

    res.status(200).json(pmsgs);
    return;
  } catch (error: any) {
    res.status(500).json({ message: error.message });
    return;
  }
};
