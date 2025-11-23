import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_BASE_URL } from "../config/api";
import {
  startLoading,
  addRequests,
  setError,
  removeRequests,
} from "../utils/requestSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const { requests, loading, error } = useSelector((store) => store.requests);

  const getRequests = useCallback(async () => {
    try {
      dispatch(startLoading());

      const res = await fetch(`${API_BASE_URL}/user/requests/received`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch requests.");
      }

      const data = await res.json();
      dispatch(addRequests(Array.isArray(data?.data) ? data.data : []));
    } catch (err) {
      console.error(err);
      dispatch(setError("Failed to load requests. Please try again."));
    }
  }, [dispatch]);

  const handleAccept = async (status, request) => {
    try {
      const { fromUserId, _id } = request;

      const res = await fetch(
        `${API_BASE_URL}/request/review/${status}/${fromUserId?._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: "",
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update request status.");
      }

      dispatch(removeRequests(_id));
    } catch (err) {
      console.error(err);
      // you can also dispatch(setError(...)) if you want a global error message here
    }
  };

  const getDaysAgo = useCallback((dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  }, []);

  useEffect(() => {
    if (!requests || requests.length === 0) {
      getRequests();
    }
  }, [getRequests, requests]);

  const hasRequests = Array.isArray(requests) && requests.length > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-center font-bold text-3xl">
        Loading Requests...
      </div>
    );
  }

  if (error && !hasRequests) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <p className="font-bold text-2xl mb-4">Something went wrong</p>
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={getRequests} className="btn">
          Retry
        </button>
      </div>
    );
  }

  if (!hasRequests) {
    return (
      <div className="flex items-center justify-center h-screen text-center font-bold text-3xl">
        No Request Found
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center m-8 py-4">
      <h2 className="card-title mb-8">All Requests</h2>
      <div className="flex-col">
        {requests.map((request) => (
          <div
            key={request._id}
            className="card flex-row justify-evenly items-center bg-primary text-primary-content m-5 w-96"
          >
            <figure className="p-5">
              <img
                src={request?.fromUserId?.photoUrl}
                alt={`${request?.fromUserId?.firstName || "User"} ${
                  request?.fromUserId?.lastName || ""
                }`}
                className="rounded-full h-28 w-28 object-cover"
              />
            </figure>
            <div className="card-body flex-col justify-between items-center">
              <div>
                <h2 className="card-title mb-1">
                  {request?.fromUserId?.firstName}{" "}
                  {request?.fromUserId?.lastName}
                </h2>
                <p className="text-sm opacity-80">
                  {getDaysAgo(request?.createdAt)}
                </p>
              </div>

              <div className="card-actions justify-end">
                <button
                  onClick={() => handleAccept("accepted", request)}
                  className="btn"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleAccept("rejected", request)}
                  className="btn"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Requests;
