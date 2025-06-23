import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { removeFeedUser } from "../utils/feedSlice";
import { HeartIcon, XCircleIcon } from "@heroicons/react/24/solid";

const FeedCard = ({ user }) => {
  const { firstName, lastName, photoUrl, age, _id } = user;
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [actionTaken, setActionTaken] = useState(""); // 'interested' or 'ignored'

  const handleInterest = async (status, id) => {
    setIsLoading(true);
    try {
      await fetch(`http://localhost:3000/request/send/${status}/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: "",
      });
      setActionTaken(status);
      setTimeout(() => dispatch(removeFeedUser(id)), 500);
    } catch (error) {
      console.error("Error sending request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-80 sm:w-96 hover:shadow-2xl transition-shadow duration-300">
      <div className="relative">
        <img
          src={photoUrl || "/default-avatar.png"}
          alt={`${firstName} ${lastName}`}
          className="w-full h-80 object-cover"
        />
        <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-2xl font-bold">
            {firstName} {lastName}
          </h2>
          <p className="text-sm">Age: {age}</p>
        </div>
      </div>

      <div className="p-4">
        {actionTaken ? (
          <div className="text-center text-green-600 font-medium">
            You marked as <strong>{actionTaken}</strong>.
          </div>
        ) : (
          <div className="flex justify-between gap-4 mt-2">
            <button
              onClick={() => handleInterest("interested", _id)}
              className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition disabled:opacity-50"
              disabled={isLoading}
            >
              <HeartIcon className="w-5 h-5" />
              {isLoading ? "Processing..." : "Interested"}
            </button>
            <button
              onClick={() => handleInterest("ignored", _id)}
              className="flex-1 flex items-center justify-center gap-2 border border-red-500 text-red-500 hover:bg-red-50 px-4 py-2 rounded-full transition disabled:opacity-50"
              disabled={isLoading}
            >
              <XCircleIcon className="w-5 h-5" />
              {isLoading ? "Processing..." : "Ignore"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedCard;
