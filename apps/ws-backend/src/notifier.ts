import { WebSocket } from "ws";

type ConnectedUser = {
  userId: string;
  ws: WebSocket;
};

export const connectedUsers: ConnectedUser[] = [];

 function notifyUser(userId: string, payload: any) {
  connectedUsers.forEach(u => {
    if (u.userId === userId && u.ws.readyState === WebSocket.OPEN) {
      u.ws.send(JSON.stringify(payload));
    }
  });
}
export {notifyUser}
