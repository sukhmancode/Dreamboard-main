"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { DashboardTabs } from "../components/DashboardTabs";
import axios from "axios";
import { JwtPayload } from "@/types/type";
import { ProfileLogoutButton } from "../hooks/handleLogout";
import { toast } from "sonner";

const DashboardPage = () => {
  const router = useRouter();
  const [name, setName] = useState("Unknown");
  const [room,setRoom] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/");
      return;
    }
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      setName(decoded.name);
    } catch {
      localStorage.removeItem("token");
      router.replace("/");
    }
  }, [router]);


  const handleCreateRoom = async() => {
    if(!room.trim()) {
      setError("Room name can't be empty");
      return; 
    }
    if(room.trim().length < 3) {
      setError("Room name must be at least 3 characters");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      const res = await axios.post("http://localhost:3001/room",
      {name:room}
      ,{
      headers:{
      Authorization: `Bearer ${token}`
      },
      
      })
      console.log("Room created:", res.data);

      toast.success(`Room created succesfully ${room}`)
      setRoom("");
      window.dispatchEvent(new Event("room-created"));
    } 
    catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to create room");
      } else {
        setError("Something went wrong");
      }
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <Pencil className="w-6 h-6 text-primary-foreground" />
          </div>

          <div className="flex flex-col">
            <span className="text-3xl font-bold">DreamBoard</span>
            <p className="text-sm text-muted-foreground">
              Welcome, {name}
            </p>
          </div>
        </div>

        <ProfileLogoutButton/>
      </div>
        <div className="mb-8 max-w-md">
          <h2 className="text-xl font-semibold mb-2">Create Room</h2>
        </div>
        <div className="flex gap-2">
          <input
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Enter room name"
            className="flex-1 border rounded-md px-3 py-2 text-sm"
          />

          <Button onClick={handleCreateRoom} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </div>
      <DashboardTabs />
    </div>
  );
};

export default DashboardPage;
