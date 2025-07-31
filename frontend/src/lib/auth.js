import Cookies from "js-cookie";

export const getStoredUser = () => {
  try {
    const userStr = Cookies.get("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

export const getStoredToken = () => {
  return Cookies.get("token") || null;
};

export const setAuthData = (user, token) => {
  Cookies.set("user", JSON.stringify(user), { expires: 7 });
  Cookies.set("token", token, { expires: 7 });
};

export const clearAuthData = () => {
  Cookies.remove("user");
  Cookies.remove("token");
};

export const isAuthenticated = () => {
  return !!(getStoredToken() && getStoredUser());
};

export const isAdmin = () => {
  const user = getStoredUser();
  return user?.role === 1;
};

// Case type mappings
export const CASE_TYPES = {
  0: "Family",
  1: "Business",
  2: "Criminal",
};

export const OPPOSITE_STATUS = {
  0: "Not Started",
  1: "Awaiting Response",
  2: "Accepted",
};

export const CASE_STATUS = {
  0: "Not Started",
  1: "Panel Created",
  2: "Mediation in Progress",
  3: "Resolved",
  4: "Unresolved",
};

export const getCaseTypeLabel = (type) => {
  return CASE_TYPES[type] || "Unknown";
};

export const getOppositeStatusLabel = (status) => {
  return OPPOSITE_STATUS[status] || "Unknown";
};

export const getCaseStatusLabel = (status) => {
  return CASE_STATUS[status] || "Unknown";
};

export const getCaseStatusColor = (status) => {
  switch (status) {
    case 0:
      return "bg-gray-100 text-gray-800";
    case 1:
      return "bg-blue-100 text-blue-800";
    case 2:
      return "bg-yellow-100 text-yellow-800";
    case 3:
      return "bg-green-100 text-green-800";
    case 4:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
