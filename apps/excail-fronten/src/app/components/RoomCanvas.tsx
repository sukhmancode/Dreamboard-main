"use client";
import { useEffect, useRef,useState } from "react";
import { WS_URL } from "../../../config";
import Canvas from "./Canvas";
export function CanvasCompo({roomId}:{roomId:string}) {
    const [socket,setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(!token) {
            return;
        }
        const ws = new WebSocket(`${WS_URL}?token=${token}`);
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