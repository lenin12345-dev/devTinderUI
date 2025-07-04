import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FeedCard from "./FeedCard";
import { addFeed } from "../utils/feedSlice";

const Feed = () => {

    const dispatch = useDispatch()
    const {feed} = useSelector((store)=>store.feed || [])

 const getFeedUser=async()=>{
    try {
        const response = await fetch("http://localhost:3000/feed?page=1&limit=10",{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials:"include"

        })
        const data = await response.json();
        dispatch(addFeed(data?.data))
       
        
    } catch (error) {
        console.log(error);
        
    }
 }
 console.log("feed",feed)
   useEffect(()=>{
    getFeedUser()
   },[])
  if (feed?.length==0) return <div className="flex items-center justify-center h-screen font-bold text-5xl">No data Found</div>

  return (
    <div className="flex justify-center">
       {feed && feed.length>0&&<FeedCard user = {feed[0]}/>}
    </div>
  );
};

export default Feed;
