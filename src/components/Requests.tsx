import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../config/axiosConfig.js";
import { extractImageUrl } from "../utils/imageUtils.js";

interface User {
  firstName: string;
  lastName: string;
  photoUrl?: string | null;
}

interface Request {
  _id: string;
  fromUserId: User;
}

// Fetch function
const fetchRequests = async (): Promise<Request[]> => {
  const { data } = await axiosInstance.get<{ data: Request[] }>(
    "/user/requests/received",
  );
  return Array.isArray(data?.data) ? data.data : [];
};

const Requests: React.FC = () => {
  const queryClient = useQueryClient();

  // ✅ Fetch requests
  const {
    data: requests = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["requests"],
    queryFn: fetchRequests,
    staleTime: 1000 * 60 * 2, // cache for 2 min
  });

  // ✅ Mutation for accept/reject
  const reviewMutation = useMutation({
    mutationFn: async ({
      status,
      requestId,
    }: {
      status: "accepted" | "rejected";
      requestId: string;
    }) => {
      return axiosInstance.post(`/request/review/${status}/${requestId}`);
    },

    // 🔥 Optimistic update
    onMutate: async ({ requestId }) => {
      await queryClient.cancelQueries({ queryKey: ["requests"] });

      const previousRequests = queryClient.getQueryData<Request[]>([
        "requests",
      ]);

      // remove immediately from UI
      queryClient.setQueryData<Request[]>(["requests"], (old = []) =>
        old.filter((req) => req._id !== requestId),
      );

      return { previousRequests };
    },

    // rollback if failed
    onError: (_err, _vars, context) => {
      if (context?.previousRequests) {
        queryClient.setQueryData(["requests"], context.previousRequests);
      }
    },

    // ensure fresh data
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });

  const hasRequests = requests.length > 0;

  return (
    <div className="flex flex-col items-center m-8 py-4">
      <h2 className="card-title mb-8">
        {isLoading
          ? "Loading Requests..."
          : isError
            ? "Error"
            : hasRequests
              ? "Connection Requests"
              : "No Requests"}
      </h2>

      {/* Error */}
      {isError && !isLoading && (
        <div className="flex flex-col items-center mb-4">
          <p className="text-red-500 mb-2 text-center">
            Failed to load requests.
          </p>
          <button onClick={() => refetch()} className="btn">
            Retry
          </button>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !hasRequests && !isError && (
        <p className="text-center text-lg opacity-70">
          You don’t have any connection requests yet.
        </p>
      )}

      {/* List */}
      <div className="flex flex-col items-center">
        {requests.map((req) => {
          const user = req.fromUserId;

          return (
            <div
              key={req._id}
              className="card flex-row justify-center items-center bg-base-100 w-96 m-5 shadow-lg"
            >
              <figure className="p-5">
                <img
                  src={extractImageUrl(user?.photoUrl)}
                  alt={`${user?.firstName} ${user?.lastName}`}
                  className="rounded-full h-28 w-28 object-cover"
                />
              </figure>

              <div className="card-body flex-col items-center">
                <h2 className="card-title mb-5 text-center">
                  {user?.firstName} {user?.lastName}
                </h2>

                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      reviewMutation.mutate({
                        status: "accepted",
                        requestId: req._id,
                      })
                    }
                    className="btn btn-success"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() =>
                      reviewMutation.mutate({
                        status: "rejected",
                        requestId: req._id,
                      })
                    }
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
