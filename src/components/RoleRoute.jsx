import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const RoleRoute = ({ children, allowedRoles }) => {
  const { role, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!allowedRoles.includes(role)) return <Navigate to="/" />;
  return children;
};

export default RoleRoute; 