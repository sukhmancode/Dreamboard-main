import { JWT_SECRET } from "@repo/backend-common/config";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export function middleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Authorization header missing",
    });
  }

  const token = authHeader.split(" ")[1]; // ✅ remove "Bearer"

  if (!token) {
    return res.status(401).json({
      message: "Token missing",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & {
      userId: string;
    };

    //@ts-ignore
    req.userId = decoded.userId;

    next(); // ✅ only call next on success
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
}
