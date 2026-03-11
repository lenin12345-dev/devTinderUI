import React, { useState, useEffect, useRef } from "react";
import { createSocketConnection } from "../utils/socket";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../config/axiosConfig";
import { Socket } from "socket.io-client";

interface Message {
  firstName: string;
  lastName: string;
  text: string;
}

interface RootState {
  user: {
    user: {
      _id: string;
      firstName: string;
      lastName: string;
    };
  };
}

interface Params {
  targetUserId: string;
}

let socket: Socket | null = null;

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { targetUserId } = useParams<Params>();
  const [input, setInput] = useState<string>("");
  const { user } = useSelector((state: RootState) => state.user);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const userId = user._id;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (): void => {
    if (!input.trim() || !socket) return;

    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: input.trim(),
    });

    setInput("");
  };

  const fetchChatMessages = async (): Promise<void> => {
    try {
      const { data: chat } = await axiosInstance.get(`/chat/${targetUserId}`);

      const chatMessages: Message[] =
        chat?.messages?.map((msg: any) => ({
          firstName: msg?.senderId?.firstName,
          lastName: msg?.senderId?.lastName,
          text: msg?.text,
        })) || [];

      setMessages(chatMessages);
    } catch (err) {
      console.error("Failed to load chat messages:", err);
    }
  };

  useEffect(() => {
    if (targetUserId) {
      fetchChatMessages();
    }
  }, [targetUserId]);

  useEffect(() => {
    if (!userId || !targetUserId) return;

    socket = createSocketConnection();

    socket.emit("goOnline", userId);
    socket.emit("joinChat", { userId, targetUserId });

    socket.on("onlineUsers", (users: string[]) => {
      setOnlineUsers(users);
    });

    socket.on("messageReceived", ({ firstName, lastName, text }: Message) => {
      setMessages((prev) => [...prev, { firstName, lastName, text }]);
    });

    return () => {
      socket?.disconnect();
    };
  }, [userId, targetUserId]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") handleSend();
  };

  const isTargetOnline = onlineUsers.includes(targetUserId || "");

  return (
    <div className="flex flex-col h-[90vh] max-w-lg mx-auto border rounded shadow bg-white">
      <div className="bg-primary text-primary-content p-4 text-center font-semibold flex items-center justify-center gap-2">
        Chat with
        {isTargetOnline && (
          <span className="text-green-400 text-xs">🟢 online</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {messages.map((msg, index) => {
          const isSender = msg.firstName === user.firstName;

          return (
            <div
              key={index}
              className={`max-w-[80%] px-4 py-2 rounded-lg ${
                isSender
                  ? "bg-blue-500 text-white self-end"
                  : "bg-gray-300 text-gray-900 self-start"
              }`}
            >
              <div className="text-xs font-semibold mb-1">{msg.firstName}</div>
              <div>{msg.text}</div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex p-4 border-t bg-white">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2 mr-2 focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Type a message..."
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
          onKeyDown={handleKeyPress}
        />
        <button onClick={handleSend} className="btn btn-primary">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
