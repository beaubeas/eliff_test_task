import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, isAdmin } from "../lib/auth";

export default function ProtectedRoute({ children, adminOnly = false }) {
  if (!isAuthenticated()) {
    return <Navigate to="/auth/login" replace />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
