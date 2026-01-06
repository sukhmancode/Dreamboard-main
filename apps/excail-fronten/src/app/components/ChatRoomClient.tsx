"use client";

import { useSocket } from "../../../../web/hooks/useSocket";
import { useEffect, useState } from "react";

type ChatMessage = { message: string };

export function ChatRoomClient({
  messages,
  id,
}: {
  messages: ChatMessage[];
  id: string;
}) {
  const { socket, loading } = useSocket();
  const [currentMessage, setCurrentMessage] = useState("");
  const [chats, setChats] = useState<ChatMessage[]>(messages);

  useEffect(() => {
    if (socket && !loading) {
      socket.send(
        JSON.stringify({
          type: "join_room",
          roomId: id,
        })
      );

      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data.toString());
        if (parsedData.type === "chat") {
          setChats((c) => [...c, { message: parsedData.message }]);
        }
      };
    }

  }, [socket, loading, id]);

  const sendMessage = () => {
    socket?.send(
      JSON.stringify({
        type: "chat",
        roomId: id,
        message: currentMessage,
      })
    );
    setCurrentMessage("");
  };

  return (
    <div>
      {chats.map((m, i) => (
        <div key={i}>
          <p>{m.message}</p>
        </div>
      ))}

      <input
        type="text"
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
}
