import WebSocket from "ws";
let ws:WebSocket | null = null;
let isConnecting = false;

function Connect() {
    if(ws && ws.readyState === WebSocket.OPEN) return;

    if(isConnecting) return;
    isConnecting = true;
    ws = new WebSocket("ws://localhost:8080?internal=true")
    
  ws.on("open", () => {
    console.log("✅ HTTP → WS connected");
    isConnecting = false;
  });

  ws.on("close", () => {
    console.log("❌ WS closed, reconnecting...");
    ws = null;
    isConnecting = false;
  });

  ws.on("error", () => {
    ws = null;
    isConnecting = false;
  });

}
export function notifyUser(userId:string,payload:any) {
    Connect();
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        console.warn("WS not ready, skipping notify");
        return;
      }
    ws.send(
        JSON.stringify({
            type:"notify_user",
            targetUserId:userId,
            payload
        })
    )
}