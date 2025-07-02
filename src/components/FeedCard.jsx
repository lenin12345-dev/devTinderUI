import React, { useState } from "react";
import { useSpring, animated as a } from "react-spring";
import { useGesture } from "@use-gesture/react";
import { useDispatch } from "react-redux";
import { removeFeedUser } from "../utils/feedSlice";
import { HeartIcon, XCircleIcon } from "@heroicons/react/24/solid";

const FeedCard = ({ user }) => {
  const { firstName, lastName, photoUrl, age, _id } = user;
  const dispatch = useDispatch();
  const [gone, setGone] = useState(false);

  const [{ x, rotate }, api] = useSpring(() => ({
    x: 0,
    rotate: 0,
    config: { tension: 300, friction: 30 },
  }));

  const bind = useGesture({
    onDrag: ({ down, movement: [mx], velocity, direction: [xDir] }) => {
      const trigger = velocity > 0.2;
      const dir = xDir < 0 ? -1 : 1;
      if (!down && trigger) {
        api.start({ x: dir * 1000, rotate: dir * 20 });
        setGone(true);
        setTimeout(() => {
          const status = dir === 1 ? "interested" : "ignored";
          handleInterest(status, _id);
        }, 300);
      } else {
        api.start({ x: down ? mx : 0, rotate: down ? mx / 20 : 0 });
      }
    },
  });

  const handleInterest = async (status, id) => {
    try {
      await fetch(`http://localhost:3000/request/send/${status}/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: "",
      });
      dispatch(removeFeedUser(id));
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  if (gone) return null;

  return (
    <a.div
      {...bind()}
      style={{
        x,
        rotate,
        touchAction: "none",
      }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden w-80 sm:w-96 cursor-grab active:cursor-grabbing select-none"
    >
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
    </a.div>
  );
};

export default FeedCard;
