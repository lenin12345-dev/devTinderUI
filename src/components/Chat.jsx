import React, { useState, useEffect, useRef } from "react";
import { createSocketConnection } from "../utils/socket";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux"; // fixed

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello!", sender: "other" },
    { id: 2, text: "Hi there!", sender: "me" },
  ]);
  const { targetUserId } = useParams();
  const [input, setInput] = useState("");
  const user = useSelector((store) => store.user); // fixed
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), text: input, sender: "me" }]);
    setInput("");
  };

  useEffect(() => {
    const socket = createSocketConnection();
    socket.emit("joinChat", targetUserId);

    return () => {
      socket.disconnect(); // clean up on unmount
    };
  }, [targetUserId]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex flex-col h-[90vh] max-w-lg mx-auto border rounded shadow bg-white">
      {/* Header */}
      <div className="bg-primary text-primary-content p-4 text-center font-semibold">
        Chat with {user?.firstName || "User"}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[80%] px-4 py-2 rounded-lg ${
              msg.sender === "me"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-300 text-gray-900 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
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
