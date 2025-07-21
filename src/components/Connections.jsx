import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import { API_BASE_URL } from "../config/api";
import { Link } from "react-router-dom";

const Connections = () => {
  const dispatch = useDispatch();
  const { connection } = useSelector((store) => store.connection);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getConnection = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE_URL}/user/connections`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch connections.");
      }

      const data = await res.json();
      dispatch(addConnection(data?.data || []));
    } catch (err) {
      console.error(err);
      setError("Failed to load connections. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    getConnection();
  }, [getConnection]);

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
          : connection?.length > 0
          ? "All Connections"
          : "No Connections"}
      </h2>

      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      <div className="flex flex-col items-center">
        {connection?.map((each) => (
          <div
            key={each._id}
            className="card flex-row justify-center items-center bg-primary text-primary-content w-96 m-5 shadow-lg"
          >
            <figure className="p-5">
              <img
                src={each?.photoUrl || "/default-avatar.png"}
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
