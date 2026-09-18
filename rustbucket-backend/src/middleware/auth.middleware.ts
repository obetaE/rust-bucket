import jwt from "jsonwebtoken";
import "dotenv/config";
import type { Request, Response, NextFunction } from "express";
import User from "../lib/models/User.ts";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "") || "";
    if (!token) return res.status(401).json({ message: "No authentication token, access denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId?: string };
    if (!decoded?.userId) return res.status(401).json({ message: "Invalid token payload" });

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ message: "Token is not valid" });

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid authentication token" });
  }
};

export default protectRoute;
