import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Body from "./Body.jsx";
import Login from "../src/components/Login.jsx";
import Profile from "../src/components/Profile.jsx";
import Feed from "../src/components/Feed.jsx";
import Connections from "../src/components/Connections.jsx";
import Requests from "../src/components/Requests.jsx";
import { useSelector } from "react-redux";

function App() {
  const ProtectedRoute = ({ element }) => {
    const { user } = useSelector((state) => state.user);
    return user ? element : <Navigate to="/login" replace />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Body />}>
          <Route
            index
            path="/"
            element={<ProtectedRoute element={<Feed />} />}
          />
          <Route
            path="/connections"
            element={<ProtectedRoute element={<Connections />} />}
          />
          <Route
            path="/requests"
            element={<ProtectedRoute element={<Requests />} />}
          />
          <Route
            path="profile"
            element={<ProtectedRoute element={<Profile />} />}
          />
        </Route>
        <Route path="/login" element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
