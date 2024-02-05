import { Request, Response } from "express";
import { Channel } from "../models/channels.model";

// GET /channels
// Get all channels
export const getChannels = async (req: Request, res: Response) => {
  res.status(501).json({ message: "Not implemented" });
};

// GET /channels/:id
// Get a channel by id
export const getChannel = async (req: Request, res: Response) => {
  res.status(501).json({ message: "Not implemented" });
};

// POST /channels
// Create a new channel
export const createChannel = async (req: Request, res: Response) => {
  res.status(501).json({ message: "Not implemented" });
}

// PUT /channels/:id
// Update a channel by id
export const updateChannel = async (req: Request, res: Response) => {
  res.status(501).json({ message: "Not implemented" });
}

// DELETE /channels/:id
// Delete a channel by id
export const deleteChannel = async (req: Request, res: Response) => {
  res.status(501).json({ message: "Not implemented" });
}