import { Request, Response } from "express";
import { Message, IMessage, IMessageAuthor } from "../models/messages.model";
import { Channel } from "../models/channels.model";
import { Pmsg } from "~/models/pmsgs.model";
import { User } from "~/models/users.model";
import { Guest } from "~/models/guests.model";

interface IAuthorName {
  username: string;
  id: string;
}

// GET /messages/:channelId || :pmsgId
// Get all messages for a channel
export const getMessages = async (req: Request, res: Response) => {
  try {
    const { channelId } = req.params;
    const channel = await Channel.findById(channelId);
    const pmsg = await Pmsg.findById(channelId);

    if (!channel && !pmsg) {
      res.status(404).json({ message: "Target(Channel / Pmsg) not found" });
      return;
    }

    const messages = await Message.find({ channelId: req.params.channelId });
    const updatedMessages = await getMessageAuthor(messages);

    res.status(200).json(updatedMessages);
    return;
  } catch (error: any) {
    res.status(500).json({ message: error.message });
    return;
  }
};

// GET /messages/:channelId || :pmsgId/:id
// Get a message by id
export const getMessage = async (req: Request, res: Response) => {
  try {
    const { channelId, id } = req.params;
    const channel = await Channel.findById(channelId);
    const pmsg = await Pmsg.findById(channelId);

    if (!channel && !pmsg) {
      res.status(404).json({ message: "Target(Channel / Pmsg) not found" });
      return;
    }

    const message = await Message.findById(id);

    if (!message) {
      res.status(404).json({ message: "Message not found" });
      return;
    } else {
      const updatedMessage = await getMessageAuthor([message]);
      res.status(200).json(updatedMessage[0]);
      return;
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
    return;
  }
};

// POST /messages/:channelId || :pmsgId
// Create a new message
export const createMessage = async (req: Request, res: Response) => {
  try {
    const { channelId } = req.params;
    const { text, authorId } = req.body;
    const channel = await Channel.findById(channelId);
    const pmsg = await Pmsg.findById(channelId);

    if (!channel && !pmsg) {
      res.status(404).json({ message: "Target(Channel, Pmsg) not found" });
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
    const updatedMessage = await getMessageAuthor([savedMessage]);
    res.status(201).json(updatedMessage[0]);
    return;
  } catch (error: any) {
    res.status(500).json({ message: error.message });
    return;
  }
};

// PUT /messages/:channelId/:id
// Update a message by id
export const updateMessage = async (req: Request, res: Response) => {
  try {
    const { channelId, id } = req.params;
    const { text, authorId } = req.body;
    const channel = await Channel.findById(channelId);
    const pmsg = await Pmsg.findById(channelId);

    if (!channel && !pmsg) {
      res.status(404).json({ message: "Target(Channel / Pmsg) not found" });
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
    return;
  } catch (error: any) {
    res.status(500).json({ message: error.message });
    return;
  }
};

// DELETE /messages/:channelId/:id
// Delete a message by id
export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { channelId, id } = req.params;
    const { authorId } = req.body;
    const channel = await Channel.findById(channelId);
    const pmsg = await Pmsg.findById(channelId);

    if (!channel && !pmsg) {
      res.status(404).json({ message: "Target (Channel / Pmsg) not found" });
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
    return;
  }
};

const getMessageAuthor = async (messages: IMessage[]) => {
  let updatedMessages: IMessageAuthor[] = [];
  let messageAuthor: IAuthorName[] = [];

  for (let i = 0; i < messages.length; i++) {
    let isAlreadyInArray = false;

    for (let j = 0; j < messageAuthor.length; j++) {
      if (messages[i].authorId === messageAuthor[j].id) {
        updatedMessages.push({
          _id: messages[i]._id,
          text: messages[i].text,
          channelId: messages[i].channelId,
          authorId: messages[i].authorId,
          author: messageAuthor[messageAuthor.length - 1].username,
          createdAt: messages[i].createdAt,
        });

        isAlreadyInArray = true;
        break;
      }
    }

    if (!isAlreadyInArray) {
      const authorName = await User.findById(messages[i].authorId);
      const authorGuest = await Guest.findById(messages[i].authorId);

      if (authorName) {
        messageAuthor.push({
          username: authorName.username,
          id: authorName.id,
        });
      } else if (authorGuest) {
        messageAuthor.push({
          username: authorGuest.username,
          id: authorGuest.id,
        });
      }

      updatedMessages.push({
        _id: messages[i]._id,
        text: messages[i].text,
        channelId: messages[i].channelId,
        authorId: messages[i].authorId,
        author: messageAuthor[messageAuthor.length - 1].username,
        createdAt: messages[i].createdAt,
      });
    }
  }

  return updatedMessages;
};
