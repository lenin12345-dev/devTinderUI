import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { removeFeedUser } from "../utils/feedSlice";

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
      setTimeout(() => dispatch(removeFeedUser(id)), 500); // Small delay for UX
    } catch (error) {
      console.error("Error sending request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 w-96 shadow-xl transition-transform hover:scale-105 duration-300">
      <figure className="px-10 pt-10">
        <img
          src={photoUrl || "/default-avatar.png"}
          alt={`${firstName} ${lastName}`}
          className="rounded-xl h-80 w-80 object-cover"
        />
      </figure>

      <div className="card-body items-center text-center">
        <h2 className="card-title text-xl font-semibold">
          {firstName} {lastName}
        </h2>
        <p className="text-gray-600 text-sm">Age: {age}</p>

        {actionTaken ? (
          <div className="mt-4 text-green-500 font-medium">
            You marked as {actionTaken}.
          </div>
        ) : (
          <div className="card-actions mt-4 flex gap-4">
            <button
              onClick={() => handleInterest("interested", _id)}
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Interested"}
            </button>
            <button
              onClick={() => handleInterest("ignored", _id)}
              className="btn btn-outline btn-error"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Ignore"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedCard;
