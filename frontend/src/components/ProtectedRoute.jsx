import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500 font-medium">Loading session...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect unauthenticated users to /login, saving current location for post-login redirect
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}