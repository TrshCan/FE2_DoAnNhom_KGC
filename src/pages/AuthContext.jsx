// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BASE_URL from "../components/BaseURL";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUserId, setCurrentUserId] = useState(
    parseInt(localStorage.getItem("currentUserId")) || null
  );
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("currentUserId"));
  const navigate = useNavigate();

  const login = (userId) => {
    localStorage.setItem("currentUserId", userId);
    setCurrentUserId(parseInt(userId));
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      const response = await fetch(`${BASE_URL}/src/includes/logout.php`, {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        localStorage.removeItem("currentUserId");
        setCurrentUserId(null);
        setIsLoggedIn(false);
        navigate("/login");
        toast.success("👋 Đăng xuất thành công!");
      } else {
        toast.error("🚫 Đăng xuất thất bại!");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("❌ Lỗi kết nối khi đăng xuất!");
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(`${BASE_URL}/src/includes/check-session.php`);
        const data = await response.json();
        if (!data.loggedIn) {
          localStorage.removeItem("currentUserId");
          setCurrentUserId(null);
          setIsLoggedIn(false);
          navigate("/login");
        }
      } catch (error) {
        console.error("Session check error:", error);
      }
    };

    if (currentUserId) {
      checkSession();
    }
  }, [currentUserId, navigate]);

  return (
    <AuthContext.Provider value={{ currentUserId, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);