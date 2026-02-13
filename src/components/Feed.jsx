import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FeedCard from "./FeedCard";
import {
  setFeed,
  addFeed,
  setLoading,
  setError,
  incrementPage,
  setHasMore,
  removeFeedUser,
} from "../utils/feedSlice";
import axiosInstance from "../config/axiosConfig";
import SkeletonCard from "./SkeletonCard";

const Feed = () => {
  const dispatch = useDispatch();
  const { feed, loading, error, page, hasMore } = useSelector(
    (store) => store.feed,
  );

  // local visible stack (current + next)
  const [cards, setCards] = useState([]);

  // prevents duplicate fetch
  const fetchingRef = useRef(false);

  // prevents strict mode double fetch
  const initialLoad = useRef(false);

  const getFeed = async (pageNumber = 1) => {
    if (!hasMore || fetchingRef.current) return;

    fetchingRef.current = true;
    dispatch(setLoading(true));

    try {
      const { data } = await axiosInstance.get(
        `/feed?page=${pageNumber}&limit=10`,
      );

      if (pageNumber === 1) {
        dispatch(setFeed(data.data));
      } else {
        dispatch(addFeed(data.data));
      }

      // backend should send hasMore
      dispatch(setHasMore(data.hasMore));

      if (data.hasMore) dispatch(incrementPage());
    } catch (err) {
      console.error(err);
      dispatch(setError("Failed to fetch feed."));
    } finally {
      dispatch(setLoading(false));
      fetchingRef.current = false;
    }
  };

  useEffect(() => {
    if (initialLoad.current) return;
    initialLoad.current = true;
    getFeed(1);
  }, []);

  useEffect(() => {
    setCards(feed.slice(0, 2)); // keep 2 cards mounted
  }, [feed]);

  useEffect(() => {
    if (feed.length <= 2 && hasMore && !loading) {
      getFeed(page);
    }
  }, [feed.length, hasMore, loading, page]);

  const handleSwipe = () => {
    dispatch(removeFeedUser());

    // remove from local stack instantly
    setCards((prev) => prev.slice(1));
  };

  if (loading && feed.length === 0) {
    return (
      <div className="flex flex-col items-center mt-10 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 font-bold">
        {error}
      </div>
    );
  }

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
        {/* next card (background) */}
        {cards[1] && (
          <FeedCard user={cards[1]} isBehind onSwipe={handleSwipe} />
        )}

        {/* current card (top) */}
        {cards[0] && <FeedCard user={cards[0]} onSwipe={handleSwipe} />}
      </div>
    </div>
  );
};

export default Feed;
