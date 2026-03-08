import io from "socket.io-client";
import { API_BASE_URL } from "../config/api.js";

export const createSocketConnection = () => {
  return io(API_BASE_URL);
};
