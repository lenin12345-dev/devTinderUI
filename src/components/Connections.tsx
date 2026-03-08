// components/Connections.jsx
import React, { useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  startLoading,
  addConnection,
  setConnectionError,
} from "../utils/connectionSlice.js";
import axiosInstance from "../config/axiosConfig.js";
import { extractImageUrl } from "../utils/imageUtils.js";
import { Link } from "react-router-dom";

const Connections = () => {
  const dispatch = useDispatch();
  const { connection, loading, error } = useSelector(
    (store) => store.connection,
  );

  const fetchedRef = useRef(false);
  const abortRef = useRef(null);
  let abortController = new AbortController();

  // Fetch connections
  const getConnection = useCallback(async () => {
    try {
      dispatch(startLoading());
      if (abortRef.current) return;
      abortRef.current = abortController;
      const { data } = await axiosInstance.get("/user/connections", {
        signal: abortController.signal,
      });
      dispatch(addConnection(Array.isArray(data?.data) ? data.data : []));
    } catch (err) {
      console.error(err);
      dispatch(
        setConnectionError("Failed to load connections. Please try again."),
      );
    }
  }, [dispatch]);

  useEffect(() => {
    // Fetch fresh data only once per mount
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      getConnection();
    }
    return () => abortController.abort();
  }, [getConnection]);

  const hasConnections = Array.isArray(connection) && connection.length > 0;

  return (
    <div
      className="flex flex-col items-center m-8 py-4"
      aria-busy={loading}
      aria-live="polite"
    >
      <h2 className="card-title mb-8">
        {loading
          ? "Loading Connections..."
          : error
            ? "Error"
            : hasConnections
              ? "All Connections"
              : "No Connections"}
      </h2>

      {/* Error + Retry */}
      {error && !loading && (
        <div className="flex flex-col items-center mb-4">
          <p className="text-red-500 mb-2 text-center">{error}</p>
          <button onClick={getConnection} className="btn">
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !hasConnections && !error && (
        <p className="text-center text-lg opacity-70">
          You don’t have any connections yet.
        </p>
      )}

      {/* Connections list */}
      <div className="flex flex-col items-center">
        {hasConnections &&
          connection.map((each) => (
            <div
              key={each._id}
              className="card flex-row justify-center items-center bg-primary text-primary-content w-96 m-5 shadow-lg"
            >
              <figure className="p-5">
                <img
                  src={extractImageUrl(each?.photoUrl)}
                  alt={`${each?.firstName || "User"} ${each?.lastName || ""}`}
                  className="rounded-full h-28 w-28 object-cover"
                />
              </figure>
              <div className="card-body flex-col justify-between items-center">
                <h2 className="card-title mb-5 text-center">
                  {each?.firstName} {each?.lastName}
                </h2>
                <Link
                  to={`/chat/${each._id}`}
                  className="btn btn-accent text-white px-4 py-2 rounded mt-2"
                >
                  Chat
                </Link>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Connections;
