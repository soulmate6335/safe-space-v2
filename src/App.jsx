import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Write from "./pages/Write";
import Sent from "./pages/Sent";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import CheckReply from "./pages/CheckReply";

import ProtectedRoute from "./components/ProtectedRoute";
import PageTransition from "./components/PageTransition";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<PageTransition><Home /></PageTransition>} />

      <Route path="/write" element={<PageTransition><Write /></PageTransition>} />

      <Route path="/sent" element={<PageTransition><Sent /></PageTransition>} />

      <Route path="/login" element={<PageTransition><Login /></PageTransition>} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <PageTransition><Admin /></PageTransition>
          </ProtectedRoute>
        }
      />

      <Route
        path="/check-reply"
        element={<PageTransition><CheckReply /></PageTransition>}
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;