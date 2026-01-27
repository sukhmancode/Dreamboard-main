"use client";

import React, { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Pencil, Eraser, Undo, Redo, Trash2, Save, Circle, Square } from "lucide-react";
import { Game } from "@/draw/Game";
import RoomJoinRequests from "./RoomJoinRequests";

export type Tool = "circle" | "rect" | "pencil" | "eraser";

interface CanvasProps {
  roomId: string;
  socket: WebSocket;
  role:"admin" | "editor" | "viewer";
  onlineUsers:string[];
  joinRequests:string[];
}

const Canvas: React.FC<CanvasProps> = ({ roomId, socket,role,onlineUsers,joinRequests }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>("pencil");
  const [game,setGame] = useState<Game>()

  useEffect(() => {
    //@ts-ignore
    window.selectedTool = selectedTool;
    game?.setTool(selectedTool)
  },[selectedTool,game])

  useEffect(() => {
    if (canvasRef.current) {
      const g  = new Game(canvasRef.current, roomId, socket);
      setGame(g)

      return() => {
        g.destroy();
      }
    }
  }, [roomId, socket]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
  
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
  
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-100">
      {/* ONLINE USERS */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow p-3 text-sm z-50">
          <p className="font-semibold mb-2 text-primary">
            Online ({onlineUsers.length})
          </p>

          {onlineUsers.map((userId) => (
            <div key={userId} className="text-muted-foreground">
              • {userId.slice(0, 6)}
            </div>
          ))}
        </div>

        {/* JOIN REQUESTS (ADMIN ONLY) */}
        <div className="fixed">
        {role === "admin" && socket && (
  <RoomJoinRequests roomId={Number(roomId)} socket={socket} />
)}
        </div>



      <TopBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} disabled={role==="viewer"}/>
      <canvas
        ref={canvasRef}
        className=" shadow-sm w-full h-screen"
      ></canvas>
    </div>
  );
};

interface TopBarProps {
  selectedTool: Tool;
  setSelectedTool: (tool: Tool) => void;
  disabled:boolean;
}

function TopBar({ selectedTool, setSelectedTool,disabled }: TopBarProps) {
  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/80 backdrop-blur-md 
      border border-gray-300 rounded-full px-4 py-2 shadow-md z-50"
    >
      {/* Drawing tools */}
      <IconButton
        icon={<Pencil />}
        activated={selectedTool === "pencil"}
        onClick={() => !disabled && setSelectedTool("pencil")}
      />
      <IconButton
        icon={<Circle />}
        activated={selectedTool === "circle"}
        onClick={() => !disabled &&  setSelectedTool("circle")}
      />
      <IconButton
        icon={<Square />}
        activated={selectedTool === "rect"}
        onClick={() => !disabled && setSelectedTool("rect")}
      />
      <IconButton
        icon={<Eraser />}
        activated={selectedTool === "eraser"}
        onClick={() => !disabled && setSelectedTool("eraser")}
      />

      {/* <div className="w-px h-6 bg-gray-300 mx-2" />
      <IconButton icon={<Undo />}  onClick={() => {}} />
      <IconButton icon={<Redo />} onClick={() => {}} />
      <IconButton icon={<Trash2 />}onClick={() => {}} />
      <IconButton icon={<Save />} onClick={() => {}} /> */}
    </div>
  );
}

export default Canvas;
