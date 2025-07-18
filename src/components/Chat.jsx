import React, { useState, useEffect, useRef } from "react";
import { createSocketConnection } from "../utils/socket";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux"; // fixed

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const { targetUserId } = useParams();
  const [input, setInput] = useState("");
  const { user } = useSelector((state) => state.user);
  const messagesEndRef = useRef(null);
  const userId = user._id;

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user.firstName,
      userId,
      targetUserId,
      text: input,
    });
    setInput("");
  };
  useEffect(() => {
    if (!userId) return;
    const socket = createSocketConnection();
    socket.emit("joinChat", { userId, targetUserId });
    socket.on("messageReceived", ({firstName, text}) => {
      setMessages(prev=>[...prev, { firstName, text }]);
    });
    return () => {
      socket.disconnect(); // clean up on unmount
    };
  }, [userId, targetUserId]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="flex flex-col h-[90vh] max-w-lg mx-auto border rounded shadow bg-white">
      {/* Header */}
      <div className="bg-primary text-primary-content p-4 text-center font-semibold">
        Chat
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[80%] px-4 py-2 rounded-lg ${
              msg.firstName === "YourName" // replace with your "me" identifier logic
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-300 text-gray-900 self-start"
            }`}
          >
            <div className="text-xs font-semibold mb-1">{msg.firstName}</div>
            <div>{msg.text}</div>
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
