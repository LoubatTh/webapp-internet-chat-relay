import { Request, Response } from "express";
import { IUser, User } from "../models/users.model";
import { Guest } from "../models/guests.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const generateHash = async (password: string) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

const generateAccessToken = async (id: string) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET!, { expiresIn: "24h" });
};

// POST /login
// Connect a user
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: "Missing field" });
      return;
    }

    const user = await User.findOne({ username: username });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isPasswordOk = await bcrypt.compare(password, user.password);

    if (!isPasswordOk) {
      res.status(401).json({ message: "Wrong password" });
      return;
    }

    const token = await generateAccessToken(user._id.toString());

    res.status(200).json({ id: user.id, token: token });
    return;
  } catch (error: any) {
    res.status(500).json(error.message);
    return;
  }
};

// POST /register
// Add a user
export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, informations } = req.body;

    if (!username || !password ) {
      res.status(400).json({ message: "Missing field" });
      return;
    }

    const checkUsername = await User.findOne({ username: username });

    if (checkUsername) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }

    const checkGuest = await Guest.findOne({ username: username });

    if (checkGuest) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: "Password too short" });
      return;
    }

    const hashedPassword = await generateHash(password);

    const data: IUser = {
      username: username,
      password: hashedPassword,
      channels: [],
      pmsgs: [],
      informations: informations ? informations : "",
      createdAt: new Date(),
    };

    const user = new User(data);
    const savedUser = await user.save();
    const token = await generateAccessToken(savedUser._id.toString());

    res.status(201).json({ token: token, user: savedUser });
    return;
  } catch (error: any) {
    res.status(500).json(error.message);
    return;
  }
};
