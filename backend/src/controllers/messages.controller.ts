import { Request, Response } from "express";
import { Message } from "../models/messages.model";

// GET /channels/:channelId/messages
// Get all messages for a channel
export const getMessages = async (req: Request, res: Response) => {
  res.status(501).json({ message: "Not implemented" });
};

// GET /channels/:channelId/messages/:id
// Get a message by id
export const getMessage = async (req: Request, res: Response) => {
  res.status(501).json({ message: "Not implemented" });
}

// POST /channels/:channelId/messages
// Create a new message
export const createMessage = async (req: Request, res: Response) => {
  res.status(501).json({ message: "Not implemented" });
}

// PUT /channels/:channelId/messages/:id
// Update a message by id
export const updateMessage = async (req: Request, res: Response) => {
  res.status(501).json({ message: "Not implemented" });
}

// DELETE /channels/:channelId/messages/:id
// Delete a message by id
export const deleteMessage = async (req: Request, res: Response) => {
  res.status(501).json({ message: "Not implemented" });
}