import io from "socket.io-client";
import { API_BASE_URL } from "../config/api";

export const createSocketConnection = () => {
  return io(API_BASE_URL);
};
