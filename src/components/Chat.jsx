import React, { useState, useEffect, useRef } from "react";
import { createSocketConnection } from "../utils/socket";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../config/api";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const { targetUserId } = useParams();
  const [input, setInput] = useState("");
  const { user } = useSelector((state) => state.user);
  const messagesEndRef = useRef(null);
  const userId = user._id;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: input,
    });
    setInput("");
  };

  const fetchChatMessages = async () => {
    const res = await fetch(`${API_BASE_URL}/chat/${targetUserId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch connections.");
    }

    const chat = await res.json();
    const chatMessages = chat?.data?.messages.map((msg) => {
      const { senderId, text } = msg;
      return {
        firstName: senderId?.firstName,
        lastName: senderId?.lastName,
        text: text,
      };
    });
    setMessages(chatMessages);
  };

  useEffect(() => {
    fetchChatMessages();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const socket = createSocketConnection();
    socket.emit("joinChat", { userId, targetUserId });
    socket.on("messageReceived", ({ firstName, lastName, text }) => {
      setMessages((prev) => [...prev, { firstName, lastName, text }]);
    });
    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex flex-col h-[90vh] max-w-lg mx-auto border rounded shadow bg-white">
      <div className="bg-primary text-primary-content p-4 text-center font-semibold">
        Chat
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
          onChange={(e) => setInput(e.target.value)}
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
