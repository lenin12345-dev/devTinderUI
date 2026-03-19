import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FeedCard from "./FeedCard.js";
import {
  setFeed,
  addFeed,
  setLoading,
  setError,
  setHasMore,
  setNextCursor,
  removeFeedUser,
} from "../utils/feedSlice.js";
import axiosInstance from "../config/axiosConfig.js";
import SkeletonCard from "./SkeletonCard.jsx";
import type { RootState, AppDispatch } from "../utils/store";

interface User {
  firstName: string;
  lastName: string;
  photoUrl?: string;
  age?: number;
  skills?: string[];
}
interface FeedResponse {
  data: User[];
  hasMore: boolean;
  nextCursor: string | null;
}

const Feed: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { feed, loading, error, hasMore, nextCursor } = useSelector(
    (store: RootState) => store.feed,
  );

  const [cards, setCards] = useState<User[]>([]);

  const fetchingRef = useRef<boolean>(false);
  const initialLoad = useRef<boolean>(false);

  // The function returns a Promise,But it does not return any value when resolved
  // If your async function returns data, the type should reflect that.
  // async function getUsers(): Promise<string[]> {return ["Alice", "Bob"];}

  const getFeed = async (): Promise<void> => {
    if (!hasMore || fetchingRef.current) return;

    fetchingRef.current = true;
    dispatch(setLoading(true));

    try {
      const url = nextCursor
        ? `/feed?cursor=${nextCursor}&limit=10`
        : `/feed?limit=10`;

      const { data } = await axiosInstance.get<FeedResponse>(url);

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
  if (loading && feed.length === 0 && !hasMore) {
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
