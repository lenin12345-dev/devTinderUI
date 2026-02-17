import React, { useState } from "react";
import { useDispatch } from "react-redux";
import TinderCard from "react-tinder-card";
import toast from "react-hot-toast";
import { removeFeedUser, addMatch } from "../utils/feedSlice";
import axiosInstance from "../config/axiosConfig";
import { extractImageUrl } from "../utils/imageUtils";

const FeedCard = ({ user, isBehind = false, onSwipe }) => {
  const { firstName, lastName, photoUrl, age, _id, skills } = user;
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const handleImageError = () => {
    console.error("Image failed to load:", extractImageUrl(photoUrl));
    setImageFailed(true);
  };

  const handleSwipe = async (dir) => {
    const action = dir === "right" ? "like" : "dislike";
    setIsProcessing(true);

    // Optimistic removal
    dispatch(removeFeedUser(_id));

    try {
      await axiosInstance.post(`/swipe/${_id}/${action}`);

      if (action === "like") {
        const { data } = await axiosInstance.get(`/match/${_id}`);
        if (data.isMatch) {
          dispatch(addMatch(user));
          toast.success(`🎉 You matched with ${firstName}!`);
        } else {
          toast.success(`❤️ Liked ${firstName}`);
        }
      } else {
        toast("👎 Passed on this profile");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed!");
      // rollback
      // Optionally, re-add user to feed
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <TinderCard key={_id} onSwipe={handleSwipe} preventSwipe={["up", "down"]}>
      <div
        className={`card bg-base-100 w-80 sm:w-96 shadow-xl transition-all duration-300 ${
          isBehind
            ? "absolute top-4 left-2 scale-95 z-0"
            : "hover:scale-105 z-10"
        }`}
      >
        <figure className="px-6 pt-6">
          <img
            src={extractImageUrl(photoUrl)}
            alt={`${firstName} ${lastName}`}
            className="rounded-xl h-72 w-full object-cover"
            onError={handleImageError}
            onLoad={() =>
              console.log(
                "Image loaded successfully:",
                extractImageUrl(photoUrl),
              )
            }
          />
        </figure>
        <div className="card-body items-center text-center">
          <h2 className="card-title text-lg font-semibold">
            {firstName} {lastName}, {age}
          </h2>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {skills?.map((skill) => (
              <span key={skill} className="badge badge-outline">
                {skill}
              </span>
            ))}
          </div>

          <div className="card-actions mt-4 flex gap-4">
            <button
              onClick={() => handleSwipe("right")}
              className="btn btn-primary"
              disabled={isProcessing}
            >
              ❤️ Like
            </button>
            <button
              onClick={() => handleSwipe("left")}
              className="btn btn-outline btn-error"
              disabled={isProcessing}
            >
              👎 Pass
            </button>
          </div>
        </div>
      </div>
    </TinderCard>
  );
};

export default FeedCard;
