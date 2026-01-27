"use client";
import { useEffect, useState } from "react";
import { HTTP_BACKEND, WS_URL } from "../../../config";
import Canvas from "./Canvas";
import { useRouter } from "next/navigation";
import axios from "axios";

export function CanvasCompo({ roomId }: { roomId: string }) {
  const router = useRouter();

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<"admin" | "editor" | "viewer">("viewer");
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [joinRequests, setJoinRequests] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    const init = async () => {
      try {
        // ✅ ACCESS CHECK
        await axios.get(`${HTTP_BACKEND}/room/${roomId}/access`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ ROLE (FIXED ENDPOINT)
        const roleRes = await axios.get(
          `${HTTP_BACKEND}/room/${roomId}/role`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRole(roleRes.data.role);

        // ✅ WS CONNECT
        const ws = new WebSocket(`${WS_URL}?token=${token}`);

        ws.onopen = () => {
          setSocket(ws);
          setLoading(false);

          ws.send(
            JSON.stringify({
              type: "join_room",
              roomId,
            })
          );
        };

        ws.onmessage = (e) => {
          const data = JSON.parse(e.data);

          // 👥 ONLINE USERS
          if (data.type === "users") {
            setOnlineUsers(data.users);
          }

          // 📥 FULL JOIN REQUEST LIST (ADMIN JOIN)
          if (data.type === "join_requests") {
            setJoinRequests(data.requests);
          }

          // 🔔 LIVE SINGLE JOIN REQUEST
          if (data.type === "join_request") {
            setJoinRequests((prev) => [
              ...prev,
              {
                id: data.requestId,
                user: data.user,
              },
            ]);
          }

          // ✅ ACCEPTED
          if (data.type === "request_accepted") {
            alert("Your request was accepted!");
            router.replace(`/canvas/${data.roomId}`);
          }

          // ❌ KICKED
          if (data.type === "kicked") {
            alert("You were removed from the room");
            router.replace("/dashboard");
          }
        };

        ws.onerror = () => {
          router.replace("/dashboard");
        };

        ws.onclose = () => {
          setSocket(null);
        };
      } catch {
        router.replace("/dashboard");
      }
    };

    init();

    return () => {
      socket?.close();
    };
  }, [roomId]);

  if (loading) return <div>Checking access…</div>;
  if (!socket) return <div>Connecting to server…</div>;

  return (
    <div className="min-h-screen bg-white">
      <Canvas
        roomId={roomId}
        socket={socket}
        role={role}
        onlineUsers={onlineUsers}
        joinRequests={joinRequests}
      />
    </div>
  );
}
