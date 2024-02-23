import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
}

export const checkJwtToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // if (!token) {
  //   return res.status(401).json({ message: "No token provided" });
  // }

  try {
    // const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // if (!decoded) {
    //   return res.status(401).json({ message: "Unauthorized" });
    // }

    // req.body.userId = decoded.id;
    next();
  } catch (error: any) {
    res.status(500).json(error.message);
  }
}