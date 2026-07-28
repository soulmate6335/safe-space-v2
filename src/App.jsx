import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Write from "./pages/Write";
import Sent from "./pages/Sent";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import AdminConversation from "./pages/AdminConversation";
import CheckReply from "./pages/CheckReply";
import Conversation from "./pages/Conversation";

import ProtectedRoute from "./components/ProtectedRoute";
import PageTransition from "./components/PageTransition";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      {/* Home */}
      <Route
        path="/"
        element={
          <PageTransition>
            <Home />
          </PageTransition>
        }
      />

      {/* Write */}
      <Route
        path="/write"
        element={
          <PageTransition>
            <Write />
          </PageTransition>
        }
      />

      {/* User Conversation */}
      <Route
        path="/conversation"
        element={
          <PageTransition>
            <Conversation />
          </PageTransition>
        }
      />

      {/* Temporary (to be removed later) */}
      <Route
        path="/sent"
        element={
          <PageTransition>
            <Sent />
          </PageTransition>
        }
      />

      {/* Login */}
      <Route
        path="/login"
        element={
          <PageTransition>
            <Login />
          </PageTransition>
        }
      />

      {/* Admin Inbox */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <PageTransition>
              <Admin />
            </PageTransition>
          </ProtectedRoute>
        }
      />

      {/* Admin Conversation */}
      <Route
        path="/admin/conversation/:id"
        element={
          <ProtectedRoute>
            <PageTransition>
              <AdminConversation />
            </PageTransition>
          </ProtectedRoute>
        }
      />

      {/* Temporary (to be removed later) */}
      <Route
        path="/check-reply"
        element={
          <PageTransition>
            <CheckReply />
          </PageTransition>
        }
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