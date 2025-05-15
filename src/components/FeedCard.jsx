import React from "react";
import { useDispatch } from "react-redux";
import {removeFeedUser} from "../utils/feedSlice"

const FeedCard = ({ user }) => {
  const { firstName, lastName, photoUrl, age, _id } = user;
  const dispatch = useDispatch()

  const handleInterest = async (status, id) => {
    try {
      await fetch(`http://localhost:3000/request/send/${status}/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body:"",

        credentials: "include",
      });
      dispatch(removeFeedUser(id))
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="card bg-base-100 w-96 shadow-xl">
      <figure className="px-10 pt-10">
        <img src={photoUrl} alt="Shoes" className="rounded-xl h-80 w-80" />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title">
          {firstName || ""} {lastName || ""}
        </h2>
        <p>Age: {age}</p>
        <div className="card-actions">
          <button
            onClick={() => handleInterest("interested", _id)}
            className="btn btn-primary"
          >
            Intersted
          </button>
          <button          onClick={() => handleInterest("ignored", _id)} className="btn btn-secondary">Ignored</button>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
