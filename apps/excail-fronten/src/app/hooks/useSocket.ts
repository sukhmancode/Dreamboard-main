import { useEffect, useState,useRef } from "react";
import { WS_URL } from "../../../config";

export function useSocket() {
    const socketRef = useRef<WebSocket | null>(null);
    const [loading, setLoading] = useState(true);
    const [connected,setConnected] = useState(false);


    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            setLoading(false);
            return;
          }
        const ws = new WebSocket(`${WS_URL}?token=${token}`);
        socketRef.current = ws;
        ws.onopen = () => {
            setConnected(true);
            setLoading(false);
        }
        ws.onerror = (err) => {
            console.error("WebSocket error", err);
          };
          ws.onclose = () => {
            setConnected(false);
          };
      
          return () => {
            ws.close();
          };
        }, []);

    return {
        socket:socketRef.current,
        loading,
        connected
    }

}