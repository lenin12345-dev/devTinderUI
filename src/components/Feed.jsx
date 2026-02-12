import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FeedCard from "./FeedCard";
import { addFeed } from "../utils/feedSlice";
import axiosInstance from "../config/axiosConfig";

const Feed = () => {
  const dispatch = useDispatch();
  const { feed } = useSelector((store) => store.feed || []);

  const getFeedUser = async () => {
    try {
      const { data } = await axiosInstance.get(`/feed?page=1&limit=10`);
      dispatch(addFeed(data?.data));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getFeedUser();
  }, []);
  if (!feed || feed.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen font-bold text-2xl">
        No data found.
      </div>
    );
  }

  return (
    <div className="flex justify-center">{<FeedCard user={feed[0]} />}</div>
  );
};

export default Feed;
