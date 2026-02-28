import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { startLoading, addRequests, setError } from "../utils/requestSlice";
import axiosInstance from "../config/axiosConfig";

const Requests = () => {
  const dispatch = useDispatch();
  const { requests, loading, error } = useSelector((store) => store.requests);

  const fetchRequests = useCallback(async () => {
    try {
      dispatch(startLoading());

      const { data } = await axiosInstance.get("/user/requests/received");

      dispatch(addRequests(Array.isArray(data?.data) ? data.data : []));
    } catch (err) {
      console.error("Request fetch failed:", err);
      dispatch(setError("Failed to load requests."));
    }
  }, [dispatch]);
  const handleReview = async (status, requestId) => {
    try {
      await axiosInstance.post(`/request/review/${status}/${requestId}`);

      // Optimistically remove from UI
      dispatch(addRequests(requests.filter((req) => req._id !== requestId)));
    } catch (err) {
      console.error("Review failed:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return (
    <div className="flex flex-col items-center py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">
        {loading
          ? "Loading Requests..."
          : error
            ? "Something went wrong"
            : requests.length > 0
              ? "Connection Requests"
              : "No Requests"}
      </h2>

      {error && !loading && (
        <button onClick={fetchRequests} className="btn btn-primary mb-6">
          Retry
        </button>
      )}

      {!loading && !error && requests.length === 0 && (
        <p className="text-gray-500">No connection requests at the moment.</p>
      )}

      <div className="flex flex-col gap-6 w-full max-w-md">
        {requests.map((req) => {
          const user = req?.fromUserId;

          if (!user) return null;

          return (
            <div
              key={req._id}
              className="card bg-base-100 shadow-xl border border-base-200"
            >
              <div className="card-body flex flex-row items-center gap-4">
                <div className="avatar">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img
                      src={
                        user.photoUrl &&
                        !user.photoUrl.includes("google.com/url")
                          ? user.photoUrl
                          : "https://via.placeholder.com/150?text=User"
                      }
                      alt="Profile"
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/150?text=User")
                      }
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <h3 className="font-semibold text-lg">
                    {user.firstName} {user.lastName}
                  </h3>

                  <p className="text-sm text-gray-500">
                    Sent you a connection request
                  </p>
                </div>
              </div>

              <div className="card-actions justify-end px-4 pb-4">
                <button
                  onClick={() => handleReview("accepted", req._id)}
                  className="btn btn-success btn-sm"
                >
                  Accept
                </button>

                <button
                  onClick={() => handleReview("rejected", req._id)}
                  className="btn btn-outline btn-error btn-sm"
                >
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;
