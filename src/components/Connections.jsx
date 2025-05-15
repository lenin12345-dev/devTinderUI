import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";

const Connections = () => {
  const dispatch = useDispatch();
  const { connection } = useSelector((store) => store.connection);

  const getConnection = async () => {
    const res = await fetch("http://localhost:3000/user/connections", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await res.json();

    dispatch(addConnection(data?.data));
  };

  useEffect(() => {
    getConnection();
  },[]);
  return (
    <div className="flex flex-col justify-center items-center m-8 py-4">
  
    <div className="flex-col">
    {connection?.length > 0?<h2 className="card-title mb-8">All Connections</h2>:<h2 className="card-title mb-8">No Connections</h2>}
      {connection?.length > 0 &&
        connection.map((each) => (
          <div
            key={each._id}
            className="card flex-row justify-center items-center bg-primary text-primary-content w-96 m-5"
          >
            <figure className="p-5">
              <img
                src={each?.photoUrl}
                alt="Shoes"
                className="rounded-full h-28 w-28"
              />
            </figure>
            <div className="card-body flex-col justify-between items-center">
            
                <h2 className="card-title mb-5">
                  {each?.firstName}{" "}
                  {each?.lastName}
                </h2>
           

             
            </div>
          </div>
        ))}
    </div>
  </div>
  );
};

export default Connections;
