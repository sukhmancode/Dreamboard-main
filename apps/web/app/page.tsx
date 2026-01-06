"use client";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { useState } from "react";

export default function Home() {
  const [roomId,setRoomId] = useState("");
  const router = useRouter();
  return (
    <div style={{
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      
    }}>
      <input type="text" name="" id="" placeholder="Room Id"
      value={roomId}
      onChange={(e) => setRoomId(e.target.value)} />

      <button onClick={() => router.push(`/room/${roomId}`)}>Join room</button>
    </div>
  );
}
