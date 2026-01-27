"use client";
import { Button } from "@/components/ui/button";
import {useEffect, useState} from "react"
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import axios from "axios";
import { HTTP_BACKEND } from "../../../config";
import { toast } from "sonner";

export function JoinRoomPopup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roomId,setRoomId] = useState("0");

  const joinRoom = async() => {
    if (!roomId.trim()) {
        toast.error("Please enter a room ID");
        return;
      }
    try {
        const token = localStorage.getItem("token");
        setLoading(true);
        const res = await axios.post(`${HTTP_BACKEND}/room/request-join`,{
            roomId
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        toast.success("Join request sent to room admin");
        setRoomId("");
    }
    catch(err:any) {
        toast.error(err.response?.data?.message || "Failed to send request");
    }
    finally {
        setLoading(false);
    }
  }
return (
    <div className="flex w-full max-w-sm flex-col gap-6">
    <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">Join Room</Button>
        </DialogTrigger>
  
        <DialogContent>
            <Input placeholder="enter room id"
            onChange={(e) => setRoomId(e.target.value)}
            type="number" />
          <Button variant="default" size="sm" onClick={joinRoom}
          disabled={loading}
          >  {loading ? "Sending request..." : "Request to Join"}</Button>

        </DialogContent>
      </Dialog>
    </div>
  );
}