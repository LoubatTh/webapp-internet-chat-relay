import { Request, Response } from "express";
import { Message, IMessage } from "../models/messages.model";
import { Channel } from "../models/channels.model";
import { User } from "~/models/users.model";
import { findSourceMap } from "module";
import { Guest } from "~/models/guests.model";

// GET /channels/:channelId/messages
// Get all messages for a channel
export const getMessages = async (req: Request, res: Response) => {
  try {
    const { channelId } = req.params;
    const channel = await Channel.findById(channelId);

    if (!channel) {
      res.status(404).json({ message: "Channel not found" });
      return;
    }

    const messages = await Message.find({ channelId: req.params.channelId });
    res.status(200).json(messages);
    return;
    // TODO: remove "any" type for error handling
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET /channels/:channelId/messages/:id
// Get a message by id
export const getMessage = async (req: Request, res: Response) => {
  try {
    const { channelId, id } = req.params;
    const channel = await Channel.findById(channelId);

    if (!channel) {
      res.status(404).json({ message: "Channel not found" });
      return;
    }

    const message = await Message.findById(id);

    if (!message) {
      res.status(404).json({ message: "Message not found" });
      return;
    } else {
      res.status(200).json(message);
      return;
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// POST /channels/:channelId/messages
// Create a new message
export const createMessage = async (req: Request, res: Response) => {
  try {
    const { channelId } = req.params;
    const { text, authorId } = req.body;
    const channel = await Channel.findById(channelId);

    if (!channel) {
      res.status(404).json({ message: "Channel not found" });
      return;
    }

    if (!text || text.length === 0) {
      res.status(400).json({ message: "Missing text field" });
      return;
    }

    if (!authorId || authorId.length === 0) {
      res.status(400).json({ message: "Missing author field" });
      return;
    }

    const checkUser = await User.findById(authorId);
    const checkGuest = await Guest.findById(authorId);

    if (!checkUser && !checkGuest) {
      res.status(404).json({ message: "Author not found" });
      return;
    }

    let data: IMessage = {
      text: text,
      channelId: channelId,
      authorId: authorId,
      createdAt: new Date(),
    };

    const message = new Message(data);
    const savedMessage = await message.save();
    res.status(201).json(savedMessage);
    return;
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /channels/:channelId/messages/:id
// Update a message by id
export const updateMessage = async (req: Request, res: Response) => {
  try {
    const { channelId, id } = req.params;
    const { text, authorId } = req.body;
    const channel = await Channel.findById(channelId);

    if (!channel) {
      res.status(404).json({ message: "Channel not found" });
      return;
    }

    if (!text) {
      res.status(400).json({ message: "Missing text field" });
      return;
    }

    if (!authorId) {
      res.status(400).json({ message: "Missing author field" });
      return;
    }

    const checkMessage = await Message.findById(id);

    if (!checkMessage) {
      res.status(400).json({ message: "Message not found" });
      return;
    }

    if (checkMessage.authorId !== authorId) {
      res.status(403).json({ message: "You can't delete this message" });
      return;
    }

    const message = await Message.findByIdAndUpdate(
      id,
      { text: text },
      { new: true }
    );

    if (!message) {
      res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json(message);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /channels/:channelId/messages/:id
// Delete a message by id
export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { channelId, id } = req.params;
    const { authorId } = req.body;
    const channel = await Channel.findById(channelId);

    if (!channel) {
      res.status(404).json({ message: "Channel not found" });
      return;
    }

    if (!authorId) {
      res.status(400).json({ message: "Missing author field" });
      return;
    }

    const checkMessage = await Message.findById(id);

    if (!checkMessage) {
      res.status(400).json({ message: "Message not found" });
      return;
    }

    if (checkMessage.authorId !== authorId) {
      res.status(403).json({ message: "You can't delete this message" });
      return;
    }

    const message = await Message.findByIdAndDelete(id);
    if (!message) {
      res.status(404).json({ message: "Message not found" });
      return;
    }

    res.status(200).json({ message: "Message deleted" });
    return;
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};
