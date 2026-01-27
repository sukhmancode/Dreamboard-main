import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prisma } from "@repo/db/client";

interface ConnectedUser {
  ws: WebSocket;
  userId: string;
  rooms: number[];
}

export const users: ConnectedUser[] = [];

const wss = new WebSocketServer({ port: 8080 });

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded?.userId ?? null;
  } catch {
    return null;
  }
}

/* ===========================
   🔔 NOTIFY USER (HTTP → WS)


/* ===========================
   🌐 WS CONNECTION
=========================== */
wss.on("connection", (ws, request) => {
  const token =
    new URLSearchParams(request.url?.split("?")[1]).get("token") || "";

  const userId = checkUser(token);
  if (!userId) {
    ws.close();
    return;
  }

  const currentUser: ConnectedUser = {
    userId,
    ws,
    rooms: [],
  };

  users.push(currentUser);

  /* ===========================
     📩 MESSAGE HANDLER
  =========================== */
  ws.on("message", async data => {
    const msg = JSON.parse(data.toString());

    /* ---------- JOIN ROOM ---------- */
    if (msg.type === "join_room") {
      const roomId = Number(msg.roomId);
      if (isNaN(roomId)) return;
    
      const room = await prisma.room.findUnique({
        where: { id: roomId },
      });
    
      const allowed = await prisma.room.findFirst({
        where: {
          id: roomId,
          OR: [
            { adminId: userId },
            { members: { some: { userId } } },
          ],
        },
      });
    
      if (!allowed) {
        ws.send(JSON.stringify({ type: "error", message: "Access denied" }));
        return;
      }
    
      if (!currentUser.rooms.includes(roomId)) {
        currentUser.rooms.push(roomId);
      }
    
      // 👑 ADMIN GETS JOIN REQUESTS
      if (room?.adminId === userId) {
        const requests = await prisma.roomJoinRequest.findMany({
          where: {
            roomId,
            status: "pending",
          },
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        });
    
        ws.send(
          JSON.stringify({
            type: "join_requests",
            requests,
          })
        );
      }
    
      broadcastUsers(roomId);
    }
    
    if (msg.type === "leave_room") {
      const roomId = Number(msg.roomId);
      currentUser.rooms = currentUser.rooms.filter(r => r !== roomId);
      broadcastUsers(roomId);
    }
    /* ---------- CHAT ---------- */
    if (msg.type === "chat") {
      const roomId = Number(msg.roomId);
      if (!currentUser.rooms.includes(roomId)) return;

      await prisma.chat.create({
        data: {
          roomId,
          message: msg.message,
          userId,
        },
      });

      users.forEach(u => {
        if (u.rooms.includes(roomId)) {
          u.ws.send(
            JSON.stringify({
              type: "chat",
              roomId,
              message: msg.message,
              userId,
            })
          );
        }
      });
    }

    /* ---------- ADMIN HANDLE REQUEST ---------- */
    if (msg.type === "handle_request") {
      const { requestId, action } = msg;

      const request = await prisma.roomJoinRequest.findUnique({
        where: { id: requestId },
        include: { room: true },
      });

      if (!request || request.room.adminId !== userId) return;

      if (action === "accept") {
        await prisma.roomMember.create({
          data: {
            roomId: request.roomId,
            userId: request.userId,
            role: "editor",
          },
        });
      
        await prisma.roomJoinRequest.update({
          where: { id: requestId },
          data: { status: "accepted" },
        });
      
        // 🔔 notify joined user
        users.forEach(u => {
          if (u.userId === request.userId) {
            u.ws.send(
              JSON.stringify({
                type: "request_accepted",
                roomId: request.roomId,
              })
            );
          }
        });
      }
      
      if (action === "reject") {
        await prisma.roomJoinRequest.update({
          where: { id: requestId },
          data: { status: "rejected" },
        });
      
        users.forEach(u => {
          if (u.userId === request.userId) {
            u.ws.send(
              JSON.stringify({
                type: "request_rejected",
                roomId: request.roomId,
              })
            );
          }
        });
      }
      
    }
  });

  /* ===========================
     ❌ CLEANUP
  =========================== */
  ws.on("close", () => {
    const index = users.indexOf(currentUser);
    if (index !== -1) users.splice(index, 1);
  });
});

/* ===========================
   👥 BROADCAST USERS IN ROOM
=========================== */
function broadcastUsers(roomId: number) {
  const online = users
    .filter(u => u.rooms.includes(roomId))
    .map(u => u.userId);

  users.forEach(u => {
    if (u.rooms.includes(roomId)) {
      u.ws.send(
        JSON.stringify({
          type: "users",
          roomId,
          users: online,
        })
      );
    }
  });
}
