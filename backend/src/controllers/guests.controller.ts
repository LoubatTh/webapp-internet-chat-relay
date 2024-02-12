import { Request, Response } from "express";
import { Guest, IGuest } from "../models/guests.model";
import { User } from "../models/users.model";
import { Channel } from "~/models/channels.model";
import { Message } from "~/models/messages.model";

// GET /guests
// Get all guests
export const getGuests = async (req: Request, res: Response) => {
  try {
    const guests = await Guest.find();
    res.status(200).json(guests);
  } catch (error: any) {
    res.status(500).json(error.message);
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
      lastConnexion: new Date(),
    };

    const guest = new Guest(data);
    const savedGuest = await guest.save();

    res.status(201).json(savedGuest);
    return;
  } catch (error: any) {
    res.status(500).json(error.message);
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
  } catch (error: any) {
    res.status(500).json(error.message);
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
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

// GET /guests/:id/channels
// Get all guest's channels
export const getGuestChannels = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const guest = await Guest.findById(id, "channels");

    if (!guest) {
      res.status(404).json({ message: "Guest not found" });
      return;
    }

    res.status(200).json(guest);
  } catch (error: any) {
    res.status(500).json(error.message);
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

    guest.channels.push(channelId);
    channel.members.push(id);
    const savedGuest = await guest.save();
    const savedChannel = await channel.save();

    res.status(200).json({ guest: savedGuest, channel: savedChannel });
  } catch (error: any) {
    res.status(500).json(error.message);
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

    guest.channels.splice(guestIndex, 1);
    channel.members.splice(channelIndex, 1);
    const savedGuest = await guest.save();
    const savedChannel = await channel.save();

    res.status(200).json({ guest: savedGuest, channel: savedChannel });
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};
