import React from "react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";

const ProtectedRoute = ({ children, redirectTo }) => {
  const { currentUser } = useUserContext();

  return currentUser ? children : <Navigate to={redirectTo} />;
};

export default ProtectedRoute;
