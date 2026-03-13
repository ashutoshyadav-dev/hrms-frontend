import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");

  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  let role = null;

  try {
    const decoded = jwtDecode(token);
    role = decoded?.role;
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

 
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }


  return children;
};

export default ProtectedRoute;

