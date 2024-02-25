import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User, IUser } from "../models/users.model";
import { Guest } from "~/models/guests.model";
import { Channel } from "~/models/channels.model";
import { Pmsg } from "~/models/pmsgs.model";

// GET /users
// Get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;

    if (name) {
      const user = await User.findOne({ username: name });

      if(!user){
        res.status(404).json({ message: "User not found"});
        return;
      }

      res.status(200).json(user);
    } else {
      const users = await User.find();
      res.status(200).json(users); 
    }
  } catch (error: any) { 
    res.status(500).json(error.message);
  }
};

// GET /users/:id
// Get a user
export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
    return;
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

// PUT /users/:id
// Update a user informations
export const updateUser = async (req: Request, res: Response) => {
  interface IUserUpdate {
    username: string;
    informations: string;
    password: string;
  }

  try {
    const { id } = req.params;
    const { username, informations, password, oldPassword } = req.body;
    const oldUsername = await User.findById(id).then((oldUser) => {
      return oldUser ? oldUser.username : "";
    });

    if (!username && !informations && !password && !oldPassword) {
      res.status(400).json({ message: "Missing field" });
      return;
    }

    const data = {} as IUserUpdate;

    if (username) {
      const checkUsername = await User.findOne({ username: username });
      const checkGuest = await Guest.findOne({ username: username });

      if (checkUsername || checkGuest) {
        res.status(400).json({ message: "Username already taken" });
        return;
      }

      data.username = username;
    }

    data.informations = informations;

    if (password && oldPassword) {
      const checkPwd = await User.findById(id);

      if (checkPwd) {
        const isPasswordOk = await bcrypt.compare(
          oldPassword,
          checkPwd.password
        );

        if (!isPasswordOk) {
          res.status(401).json({ message: "Wrong password" });
          return;
        }

        if (checkPwd) {
          const saltRounds = 10;
          data.password = await bcrypt.hash(password, saltRounds);
        }
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } else if (password && !oldPassword) {
      res.status(400).json({ message: 'Missing "oldPassword" field' });
      return;
    }

    const user = await User.findByIdAndUpdate(id, data, { new: true });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

// DELETE /users/:id
// Delete a user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    for (let i = 0; i < user.channels.length; i++) {
      const channel = await Channel.findById(user.channels[i]);

      if (!channel) {
        res.status(404).json({ message: "Channel not found" });
        return;
      }

      const channelIndex = channel.members.indexOf(user.username);

      if (channelIndex === -1) {
        res.status(404).json({ message: "User not found in channel" });
        return;
      }

      channel.members.splice(channelIndex, 1);
      await channel.save();
    }

    res.status(200).json({ message: "User deleted" });
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

// GET /users/:id/channels
// Get all user's channels
export const getUserChannels = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id, "channels");
    const visibility = req.query.visibility as string;
    let channels = [];

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    for (let i = 0; i < user.channels.length; i++) {
      const channel = await Channel.findById(user.channels[i]);

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
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

// POST /users/:id/channels
// Add a channel to user's channels
export const addUserChannel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { channelId } = req.body;

    if (!channelId) {
      res.status(400).json({ message: "Missing field" });
      return;
    }

    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const channel = await Channel.findById(channelId);

    if (!channel) {
      res.status(404).json({ message: "Channel not found" });
      return;
    }

    for (let i = 0; i < user.channels.length; i++) {
      if (channelId === user.channels[i]) {
        res.status(400).json({ message: "channel already joined" });
        return;
      }
    }

    user.channels.push(channelId);
    channel.members.push(id);
    const savedUser = await user.save();
    const savedChannel = await channel.save();

    res.status(200).json({ user: savedUser, channel: savedChannel });
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

// DELETE /users/:id/channels/:channelId
// Remove a channel from user's channels
export const removeUserChannel = async (req: Request, res: Response) => {
  try {
    const { id, channelId } = req.params;
    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const channel = await Channel.findById(channelId);

    if (!channel) {
      res.status(404).json({ message: "Channel not found" });
      return;
    }

    const userIndex = user.channels.indexOf(channelId);

    if (userIndex === -1) {
      res.status(404).json({ message: "Channel not found in user" });
      return;
    }

    const channelIndex = channel.members.indexOf(id);

    if (channelIndex === -1) {
      res.status(404).json({ message: "User not found in channel" });
      return;
    }

    user.channels.splice(userIndex, 1);
    channel.members.splice(channelIndex, 1);
    const savedUser = await user.save();
    const savedChannel = await channel.save();

    res.status(200).json({ user: savedUser, channel: savedChannel });
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

// GET /users/:id/pmsg
// Get user private messages
export const getUserPmsgs = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id, "pmsgs");
    let pmsgs = [];

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    for (let i = 0; i < user.pmsgs.length; i++) {
      const pmsg = await Pmsg.findById(user.pmsgs[i]);

      if (!pmsg) {
        res.status(404).json({ message: "Channel not found" });
        return;
      }

      pmsgs.push(pmsg);
    }

    res.status(200).json(pmsgs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
