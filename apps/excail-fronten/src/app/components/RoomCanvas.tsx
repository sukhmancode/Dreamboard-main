"use client";
import { useEffect, useRef,useState } from "react";
import { WS_URL } from "../../../config";
import Canvas from "./Canvas";
export function CanvasCompo({roomId}:{roomId:string}) {
    const [socket,setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5ODY5M2QyNy1hNDJkLTQxN2MtOWNjMC02NGRkOTA1MTkzOWEiLCJpYXQiOjE3NjA3NzgwNzZ9.0JL8jLo80tO7iagqHrQqMp3rd8N1vwo0TyPxWQA_CJk`);
        ws.onopen = () => {
            setSocket(ws)
            ws.send(JSON.stringify({
                type:"join_room",
                roomId
            }))
        }
    },[])



    if(!socket) {
        return (
            <div>
                Connecting to the server..
            </div>
        )
    }
    return (
        <div className="min-h-screen bg-white">
            <Canvas roomId={roomId} socket={socket}/>
        </div>
    )
}