import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [userInfo, setUserInfo] = useState({ username: '', email: '' });
  const [showTooltip, setShowTooltip] = useState(false);

  const menuItems = [
    { path: "/admin/users", label: "Quản lý User", icon: "👥" },
    { path: "/admin/user-heroes", label: "Quản lý User-Hero", icon: "🦸‍♂️" },
    { path: "/admin/mails", label: "Quản lý Mail", icon: "✉️" },
    { path: "/admin/classes", label: "Quản lý Classes", icon: "🏫" },
    { path: "/admin/heroes", label: "Quản lý Hero", icon: "🦸" },
    { path: "/admin/hero-skills", label: "Quản lý Hero Skill", icon: "⚡" },
    { path: "/admin/enemies", label: "Quản lý Enemy", icon: "👾" },
    { path: "/admin/enemy-skills", label: "Quản lý Enemy Skill", icon: "💥" },
    { path: "/admin/regions", label: "Quản lý Region", icon: "🗺️" },
    { path: "/admin/sundries", label: "Quản lý Sundry", icon: "🧰" },
    { path: "/admin/item-effects", label: "Quản lý Item-Effect", icon: "✨" },
    { path: "/admin/xp-amounts", label: "Quản lý Xp-Amounts", icon: "📈" },
    { path: "/admin/inventory", label: "Quản lý Inventory", icon: "📦" },
    { path: "/admin/level-requirements", label: "Quản lý Level Requirements", icon: "📊" },
  ];

  // Extract current page title
  const currentPageTitle = menuItems.find(item => location.pathname === item.path)?.label || "Quản lý User";

  // Fetch user info on mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/get-user-info.php', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        if (data.success && data.user) {
          setUserInfo({
            username: data.user.username,
            email: data.user.email,
          });
        } else {
          toast.error(`🚫 ${data.message || 'Không thể lấy thông tin người dùng.'}`);
        }
      } catch (error) {
        console.error('Fetch user info error:', error);
        toast.error('❌ Kết nối đến máy chủ thất bại.');
      }
    };
    fetchUserInfo();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout.php', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        toast.success('🧙‍♂️ Đăng xuất thành công! Chuyển hướng về trang đăng nhập...', {
          position: 'top-center',
          autoClose: 2000,
          style: {
            backgroundColor: '#6a0dad',
            color: '#fff4f4',
            fontSize: '16px',
            fontWeight: 'bold',
            borderRadius: '12px',
            boxShadow: '0 0 10px #ffb347',
          },
          icon: '✨',
        });
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error(`🚫 ${data.message || 'Đăng xuất thất bại. Vui lòng thử lại.'}`);
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('❌ Kết nối đến máy chủ thất bại.');
    }
  };

  return (
    <div style={{ 
      display: "flex", 
      height: "100vh", 
      width: "100vw", 
      minWidth: "100vw", 
      fontFamily: "'Segoe UI', 'Roboto', sans-serif",
      boxSizing: "border-box"
    }}>
      {/* Sidebar */}
      <div 
        style={{ 
          width: collapsed ? "70px" : "250px",
          height: "100vh",
          background: "#343a40",
          color: "white",
          transition: "width 0.3s ease",
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 100
        }}
      >
        {/* Header */}
        <div style={{ 
          padding: collapsed ? "20px 0" : "20px", 
          borderBottom: "1px solid #495057",
          width: "100%",
          display: "flex",
          justifyContent: collapsed ? "center" : "space-between",
          alignItems: "center" 
        }}>
          {!collapsed && <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#61dafb" }}>Admin Panel</h2>}
          <button 
            onClick={() => setCollapsed(!collapsed)} 
            style={{ 
              background: "#495057",
              border: "none", 
              color: "white", 
              cursor: "pointer",
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "0.8rem",
              transition: "background 0.2s ease"
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = "#5a6268"; }}
            onMouseOut={(e) => { e.currentTarget.style.background = "#495057"; }}
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ 
          flex: 1, 
          padding: "15px 0", 
          overflowY: "auto", 
          scrollbarWidth: "thin",
          scrollbarColor: "#495057 #343a40"
        }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  style={{
                    textDecoration: "none",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 20px",
                    backgroundColor: location.pathname === item.path ? "#495057" : "transparent",
                    borderLeft: location.pathname === item.path ? "4px solid #61dafb" : "4px solid transparent",
                    transition: "all 0.2s ease",
                    fontSize: "0.95rem",
                  }}
                  onMouseOver={(e) => {
                    if (location.pathname !== item.path) {
                      e.currentTarget.style.backgroundColor = "#424c56";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (location.pathname !== item.path) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <span style={{ 
                    marginRight: collapsed ? "0" : "10px", 
                    fontSize: "1.2rem", 
                    minWidth: "24px",
                    textAlign: "center" 
                  }}>
                    {item.icon}
                  </span>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main content area */}
      <div style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column",
        backgroundColor: "#f8f9fa",
        height: "100vh",
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box"
      }}>
        {/* Header */}
        <header style={{ 
          background: "white", 
          height: "60px", 
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          justifyContent: "space-between",
          width: "100%",
          boxSizing: "border-box"
        }}>
          <h1 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 500 }}>{currentPageTitle}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "15px", position: "relative" }}>
            <div 
              style={{ 
                width: "40px", 
                height: "40px", 
                borderRadius: "50%", 
                backgroundColor: "#e9ecef", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                cursor: "pointer"
              }}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <span style={{ fontSize: "1.2rem" }}>👤</span>
              {showTooltip && (
                <div style={{
                  position: "absolute",
                  top: "50px",
                  right: 0,
                  backgroundColor: "#343a40",
                  color: "white",
                  padding: "10px",
                  borderRadius: "5px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  zIndex: 1000,
                  minWidth: "200px",
                  textAlign: "left",
                  fontSize: "0.9rem"
                }}>
                  <p style={{ margin: "5px 0" }}><strong>Tên:</strong> {userInfo.username || 'N/A'}</p>
                  <p style={{ margin: "5px 0" }}><strong>Email:</strong> {userInfo.email || 'N/A'}</p>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: "#dc3545",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "0.9rem",
                transition: "background 0.2s ease"
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = "#c82333"; }}
              onMouseOut={(e) => { e.currentTarget.style.background = "#dc3545"; }}
            >
              Đăng xuất
            </button>
          </div>
        </header>

        {/* Content area */}
        <main style={{ 
          flex: 1, 
          padding: "30px", 
          overflow: "auto",
          width: "100%",
          minWidth: "100%",
          boxSizing: "border-box"
        }}>
          <div style={{ width: "100%", minWidth: "100%" }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;