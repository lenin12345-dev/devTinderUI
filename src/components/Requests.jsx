import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_BASE_URL } from "../config/api";

import { addRequests, removeRequests } from "../utils/requestSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const { requests } = useSelector((store) => store.requests);

  const getRequests = async () => {
    const res = await fetch(`${API_BASE_URL}/user/requests/received`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await res.json();

    dispatch(addRequests(data?.data));
  };
  const handleAccept = async (status, request) => {
    try {
      const { fromUserId, _id } = request;
      await fetch(
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
      dispatch(removeRequests(_id));
    } catch (error) {
      console.error(error);
    }
  };
  const getDaysAgo = useMemo((dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  },[]);

  useEffect(() => {
    if (requests.length == 0) getRequests();
  }, []);
  console.log(requests);

  if (requests.length == 0)
    return (
      <div className="flex items-center justify-center h-screen text-center font-bold text-3xl">
        No data Found
      </div>
    );
  return (
    <div className="flex flex-col justify-center items-center m-8 py-4">
      <h2 className="card-title mb-8">All Requests</h2>
      <div className="flex-col">
        {requests?.length > 0 &&
          requests.map((request) => (
            <div
              key={request._id}
              className="card flex-row   justify-evenly items-center bg-primary text-primary-content m-5 w-96"
            >
              <figure className="p-5">
                <img
                  src={request?.fromUserId?.photoUrl}
                  alt="Shoes"
                  className="rounded-full h-28 w-28"
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
