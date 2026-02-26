import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "./Body.jsx";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./routes/ProtectedRoute";
import { lazy, Suspense } from "react";
import FullPageLoader from "./components/ui/FullPageLoader.jsx";

// Lazy-loaded pages
const Feed = lazy(() => import("./components/Feed.jsx"));
const Profile = lazy(() => import("./components/Profile.jsx"));
const Chat = lazy(() => import("./components/Chat.jsx"));
const Connections = lazy(() => import("./components/Connections.jsx"));
const Requests = lazy(() => import("./components/Requests.jsx"));
const Authpage = lazy(() => import("./components/Authpage.jsx"));
import useAuthInit from "../src/hooks/useAuthInit.js";

function App() {
  useAuthInit();
  return (
    <BrowserRouter>
      <Toaster position="top-center" />

      <Suspense fallback={<FullPageLoader />}>
        <Routes>
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Body />}>
              {/* It means: when user visits / exactly, render <Feed /> inside <Body />. */}
              <Route index element={<Feed />} />
              <Route path="connections" element={<Connections />} />
              <Route path="requests" element={<Requests />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            <Route path="/chat/:targetUserId" element={<Chat />} />
          </Route>

          {/* Auth Route */}
          <Route path="/auth" element={<Authpage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
