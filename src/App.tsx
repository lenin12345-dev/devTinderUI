import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "./Body.js";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./routes/ProtectedRoute.js";
import { lazy, Suspense } from "react";
import FullPageLoader from "./components/ui/FullPageLoader.jsx";

// Lazy-loaded pages
const Feed = lazy(() => import("./components/Feed.js"));
const Profile = lazy(() => import("./components/Profile.js"));
const Chat = lazy(() => import("./components/Chat.js"));
const Connections = lazy(() => import("./components/Connections.js"));
const Requests = lazy(() => import("./components/Requests.js"));
const Authpage = lazy(() => import("./components/Authpage.js"));
import useAuthInit from "./hooks/useAuthInit.js";

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

          <Route path="/auth" element={<Authpage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
