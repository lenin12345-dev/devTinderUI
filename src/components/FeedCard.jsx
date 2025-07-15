import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { removeFeedUser } from "../utils/feedSlice";
import { API_BASE_URL } from "../config/api";
import toast from "react-hot-toast";

const FeedCard = ({ user }) => {
  const { firstName, lastName, photoUrl, age, _id } = user;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleInterest = async (status, id) => {
    setIsLoading(true);
    try {
      await fetch(`${API_BASE_URL}/request/send/${status}/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      toast.success(`Marked as ${status}`);
      setTimeout(() => dispatch(removeFeedUser(id)), 500); // Small delay for UX
    } catch (error) {
      console.error("Error sending request:", error);
      toast.error("Action failed, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 w-80 sm:w-96 shadow-xl transition-transform hover:scale-105 duration-300">
      <figure className="px-6 pt-6">
        <img
          src={photoUrl || "/default-avatar.png"}
          alt={`${firstName} ${lastName}`}
          className="rounded-xl h-72 w-full object-cover"
        />
      </figure>

      <div className="card-body items-center text-center">
        <h2 className="card-title text-lg font-semibold">
          {firstName} {lastName}
        </h2>
        <p className="text-gray-600 text-sm">Age: {age}</p>

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
      </div>
    </div>
  );
};

export default FeedCard;
