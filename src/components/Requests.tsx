import React, { useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  startLoading,
  addRequests,
  setError,
  removeRequests,
} from "../utils/requestSlice.js";
import axiosInstance from "../config/axiosConfig.js";
import { extractImageUrl } from "../utils/imageUtils.js";
import type { RootState, AppDispatch } from "../utils/store.js";

interface User {
  firstName: string;
  lastName: string;
  photoUrl?: string | null;
}

interface Request {
  _id: string;
  fromUserId: User;
}

const Requests: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { requests, loading, error } = useSelector(
    (state: RootState) => state.requests,
  );

  const fetchedRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const abortController = new AbortController();

  // Fetch requests
  const getRequests = useCallback(async () => {
    try {
      dispatch(startLoading());

      if (abortRef.current) return;
      abortRef.current = abortController;

      const { data } = await axiosInstance.get<{ data: Request[] }>(
        "/user/requests/received",
        {
          signal: abortController.signal,
        },
      );

      dispatch(addRequests(Array.isArray(data?.data) ? data.data : []));
    } catch (err) {
      console.error("Request fetch failed:", err);
      dispatch(setError("Failed to load requests. Please try again."));
    }
  }, [dispatch]);

  const handleReview = async (
    status: "accepted" | "rejected",
    requestId: string,
  ) => {
    try {
      await axiosInstance.post(`/request/review/${status}/${requestId}`);
      dispatch(removeRequests(requestId));
    } catch (err) {
      console.error("Review failed:", err);
    }
  };

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      getRequests();
    }

    return () => abortController.abort();
  }, [getRequests]);

  const hasRequests = Array.isArray(requests) && requests.length > 0;

  return (
    <div
      className="flex flex-col items-center m-8 py-4"
      aria-busy={loading}
      aria-live="polite"
    >
      <h2 className="card-title mb-8">
        {loading
          ? "Loading Requests..."
          : error
            ? "Error"
            : hasRequests
              ? "Connection Requests"
              : "No Requests"}
      </h2>

      {/* Error + Retry */}
      {error && !loading && (
        <div className="flex flex-col items-center mb-4">
          <p className="text-red-500 mb-2 text-center">{error}</p>
          <button onClick={getRequests} className="btn">
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !hasRequests && !error && (
        <p className="text-center text-lg opacity-70">
          You don’t have any connection requests yet.
        </p>
      )}

      {/* Requests list */}
      <div className="flex flex-col items-center">
        {hasRequests &&
          requests.map((req) => {
            const user = req.fromUserId;

            return (
              <div
                key={req._id}
                className="card flex-row justify-center items-center bg-base-100 w-96 m-5 shadow-lg"
              >
                <figure className="p-5">
                  <img
                    src={extractImageUrl(user?.photoUrl)}
                    alt={`${user?.firstName || "User"} ${user?.lastName || ""}`}
                    className="rounded-full h-28 w-28 object-cover"
                  />
                </figure>

                <div className="card-body flex-col justify-between items-center">
                  <h2 className="card-title mb-5 text-center">
                    {user?.firstName} {user?.lastName}
                  </h2>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleReview("accepted", req._id)}
                      className="btn btn-success"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => handleReview("rejected", req._id)}
                      className="btn btn-outline btn-error"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Requests;
