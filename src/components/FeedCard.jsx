import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { removeFeedUser } from "../utils/feedSlice";
import axiosInstance from "../config/axiosConfig";
import toast from "react-hot-toast";

const FeedCard = ({ user }) => {
  const { firstName, lastName, photoUrl, age, _id } = user;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleInterest = async (action, id) => {
    setIsLoading(true);
    try {
      // Send swipe (like or dislike)
      await axiosInstance.post(`/swipe/${id}/${action}`);

      // Check for match if action is "like"
      if (action === "like") {
        const { data } = await axiosInstance.get(`/match/${id}`);

        if (data.isMatch) {
          toast.success("🎉 It's a match!");
        } else {
          toast.success("❤️ Like sent!");
        }
      } else {
        toast.success("Passed on this profile");
      }

      // Remove user from feed
      setTimeout(() => dispatch(removeFeedUser(id)), 500);
    } catch (error) {
      console.error("Error during swipe:", error);
      toast.error(
        error.response?.data?.message || "Action failed, please try again.",
      );
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
            onClick={() => handleInterest("like", _id)}
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "❤️ Like"}
          </button>
          <button
            onClick={() => handleInterest("dislike", _id)}
            className="btn btn-outline btn-error"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "👎 Pass"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
