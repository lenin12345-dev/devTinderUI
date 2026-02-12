import axiosInstance from "./axiosConfig";

// Send a like/dislike swipe
export const swipeUser = async (toUserId, action) => {
  try {
    const response = await axiosInstance.post(`/swipe/${toUserId}/${action}`);
    return response.data;
  } catch (error) {
    console.error("Swipe error:", error);
    throw error;
  }
};

// Check if two users matched
export const checkMatch = async (userId) => {
  try {
    const response = await axiosInstance.get(`/match/${userId}`);
    return response.data.isMatch;
  } catch (error) {
    console.error("Match check error:", error);
    throw error;
  }
};

// Get all swipes by current user
export const getUserSwipes = async () => {
  try {
    const response = await axiosInstance.get(`/swipes`);
    return response.data.swipes;
  } catch (error) {
    console.error("Get swipes error:", error);
    throw error;
  }
};
};
