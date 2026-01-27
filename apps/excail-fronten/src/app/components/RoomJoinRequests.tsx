"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { HTTP_BACKEND } from "../../../config";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type JoinRequest = {
  id: number;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

type Props = {
  roomId: number;
  socket: WebSocket; // 👈 pass WS from parent
};

const RoomJoinRequests = ({ roomId, socket }: Props) => {
  const [requests, setRequests] = useState<JoinRequest[]>([]);

  /* ===========================
     📥 INITIAL LOAD (HTTP)
  =========================== */
  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${HTTP_BACKEND}/room/${roomId}/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setRequests(res.data.requests))
      .catch(() => toast.error("Failed to load join requests"));
  }, [roomId]);

  /* ===========================
     ⚡ REAL-TIME WS UPDATES
  =========================== */
  useEffect(() => {
    if (!socket) return;

    const onMessage = (e: MessageEvent) => {
      const data = JSON.parse(e.data);

      if (data.type === "join_request") {
        setRequests(prev => [...prev, data.request]);
      }
    };

    socket.addEventListener("message", onMessage);

    return () => socket.removeEventListener("message", onMessage);
  }, [socket]);

  /* ===========================
     ✅ ACCEPT / ❌ REJECT
  =========================== */
  const handleAction = async (
    requestId: number,
    action: "accept" | "reject"
  ) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${HTTP_BACKEND}/room/handle-request`,
        { requestId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(
        action === "accept"
          ? "User added to room"
          : "Request rejected"
      );

      setRequests(prev => prev.filter(r => r.id !== requestId));
    } catch {
      toast.error("Action failed");
    }
  };

  if (requests.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No pending join requests
      </p>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      {requests.map(req => (
        <div
          key={req.id}
          className="flex justify-between items-center border rounded-lg p-3"
        >
          <div>
            <p className="font-medium">{req.user.name}</p>
            <p className="text-xs text-muted-foreground">
              {req.user.email}
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => handleAction(req.id, "accept")}>
              Accept
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleAction(req.id, "reject")}
            >
              Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomJoinRequests;
