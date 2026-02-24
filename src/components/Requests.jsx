import React, { useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { startLoading, addRequests, setError } from "../utils/requestSlice";
import axiosInstance from "../config/axiosConfig";

const Requests = () => {
  const dispatch = useDispatch();
  const { requests, loading, error } = useSelector((store) => store.requests);

  const fetchedRef = useRef(false);

  const getRequests = useCallback(async () => {
    try {
      dispatch(startLoading());
      const { data } = await axiosInstance.get("/user/requests/received");
      console.log("Received requests:", data);
      dispatch(addRequests(Array.isArray(data?.data) ? data.data : []));
    } catch (err) {
      console.error(err);
      dispatch(setError("Failed to load requests."));
    }
  }, [dispatch]);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    getRequests();
  }, [getRequests]);

  return (
    <div className="flex flex-col items-center m-8 py-4">
      <h2 className="text-xl font-bold mb-4">
        {loading
          ? "Loading Requests..."
          : error
            ? "Error"
            : requests.length
              ? "Connection Requests"
              : "No Requests"}
      </h2>

      {error && !loading && (
        <button onClick={getRequests} className="btn mb-4">
          Retry
        </button>
      )}

      {!loading && requests.length === 0 && !error && (
        <p>No connection requests at the moment.</p>
      )}

      <div className="flex flex-col gap-4">
        {requests.map((req) => (
          <div key={req._id} className="card p-4 shadow-lg w-96">
            <p>
              {req.fromUserId.firstName} {req.fromUserId.lastName} sent a
              request.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Requests;
