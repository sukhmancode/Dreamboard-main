import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";
export function useSocket (){
    const [loading,setLoading] = useState<boolean>(true)
    const [socket,setSocket]  = useState<WebSocket>();

useEffect(() => {
    const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0ZGQ3MWMwYy03ODQ5LTRmOGMtOWNhYy1iMzQ1MzFmZGM5NTgiLCJpYXQiOjE3NTQwNDU5MTd9.WdCTADkspwSbdDgppPb6Gk1Vc-biD_gUNi51NNXrtGk`);
    ws.onopen = () => {
        setLoading(false);
        setSocket(ws)
    }
    },[])
    return {
        socket,loading
    }
}