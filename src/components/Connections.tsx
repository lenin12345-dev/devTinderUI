import React from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../config/axiosConfig";
import { extractImageUrl } from "../utils/imageUtils";
import { Link } from "react-router-dom";

interface Connection {
  _id: string;
  firstName: string;
  lastName: string;
  photoUrl?: string | null;
}

const fetchConnections = async (): Promise<Connection[]> => {
  const { data } = await axiosInstance.get<{ data: Connection[] }>(
    "/user/connections",
  );
  return Array.isArray(data?.data) ? data.data : [];
};

const Connections: React.FC = () => {
  const {
    data: connections = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["connections"],
    queryFn: fetchConnections,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
    retry: 2,
  });

  const hasConnections = connections.length > 0;

  return (
    <div className="flex flex-col items-center m-8 py-4">
      <h2 className="card-title mb-8">
        {isLoading
          ? "Loading Connections..."
          : isError
            ? "Error"
            : hasConnections
              ? "All Connections"
              : "No Connections"}
      </h2>

      {/* Error */}
      {isError && !isLoading && (
        <div className="flex flex-col items-center mb-4">
          <p className="text-red-500 mb-2 text-center">
            Failed to load connections.
          </p>
          <button onClick={() => refetch()} className="btn">
            Retry
          </button>
        </div>
      )}

      {!isLoading && !hasConnections && !isError && (
        <p className="text-center text-lg opacity-70">
          You don’t have any connections yet.
        </p>
      )}

      <div className="flex flex-col items-center">
        {connections.map((user) => (
          <div
            key={user._id}
            className="card flex-row justify-center items-center bg-primary text-primary-content w-96 m-5 shadow-lg"
          >
            <figure className="p-5">
              <img
                src={extractImageUrl(user?.photoUrl)}
                alt={`${user?.firstName} ${user?.lastName}`}
                className="rounded-full h-28 w-28 object-cover"
              />
            </figure>

            <div className="card-body flex-col justify-between items-center">
              <h2 className="card-title mb-5 text-center">
                {user?.firstName} {user?.lastName}
              </h2>

              <Link
                to={`/chat/${user._id}`}
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
