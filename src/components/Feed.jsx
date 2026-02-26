import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FeedCard from "./FeedCard";
import {
  setFeed,
  addFeed,
  setLoading,
  setError,
  setHasMore,
  setNextCursor,
  removeFeedUser,
} from "../utils/feedSlice";
import axiosInstance from "../config/axiosConfig";
import SkeletonCard from "./SkeletonCard";

const Feed = () => {
  const dispatch = useDispatch();

  const { feed, loading, error, hasMore, nextCursor } = useSelector(
    (store) => store.feed,
  );

  const [cards, setCards] = useState([]);

  const fetchingRef = useRef(false);
  const initialLoad = useRef(false);

  const getFeed = async () => {
    if (!hasMore || fetchingRef.current) return;

    fetchingRef.current = true;
    dispatch(setLoading(true));

    try {
      const url = nextCursor
        ? `/feed?cursor=${nextCursor}&limit=10`
        : `/feed?limit=10`;

      const { data } = await axiosInstance.get(url);

      if (!nextCursor) {
        dispatch(setFeed(data.data));
      } else {
        dispatch(addFeed(data.data));
      }

      dispatch(setHasMore(data.hasMore));
      dispatch(setNextCursor(data.nextCursor));
    } catch (err) {
      console.error(err);
      dispatch(setError("Failed to fetch feed."));
    } finally {
      dispatch(setLoading(false));
      fetchingRef.current = false;
    }
  };

  // Initial Load
  useEffect(() => {
    if (initialLoad.current) return;
    initialLoad.current = true;
    getFeed();
  }, []);

  // Maintain 2-card stack
  useEffect(() => {
    setCards(feed.slice(0, 2));
  }, [feed]);

  // Auto fetch when feed is low
  useEffect(() => {
    if (feed.length <= 2 && hasMore && !loading) {
      getFeed();
    }
  }, [feed.length, hasMore, loading]);

  const handleSwipe = () => {
    dispatch(removeFeedUser());
    setCards((prev) => prev.slice(1));
  };

  // Loading UI
  if (loading && feed.length === 0) {
    return (
      <div className="flex flex-col items-center mt-10 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 font-bold">
        {error}
      </div>
    );
  }

  // No Data UI
  if (!cards || cards.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen font-bold text-2xl">
        No devs found.
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="relative w-[350px] h-[520px]">
        {cards[1] && (
          <FeedCard user={cards[1]} isBehind onSwipe={handleSwipe} />
        )}

        {cards[0] && <FeedCard user={cards[0]} onSwipe={handleSwipe} />}
      </div>
    </div>
  );
};

export default Feed;
