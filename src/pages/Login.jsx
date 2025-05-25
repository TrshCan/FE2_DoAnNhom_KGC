import "../assets/css/AuthModal.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from "../components/BaseURL";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast.error("📛 Email không hợp lệ!");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/src/includes/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Login response:", data); // Debug log
      if (data.success && data.user_id) {
        localStorage.setItem("currentUserId", parseInt(data.user_id));
        console.log("Stored user_id:", localStorage.getItem("currentUserId")); // Verify storage
        toast.success("🧙‍♂️ Đăng nhập thành công! Cổng phép thuật đã mở...", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          style: {
            backgroundColor: "#6a0dad",
            color: "#fff4f4",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "12px",
            boxShadow: "0 0 10px #ffb347",
          },
          icon: "✨",
        });
        setIsLoggedIn(true);
      } else {
        toast.error(`🚫 ${data.message || "Không nhận được ID người dùng!"}`);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("❌ Kết nối đến máy chủ thất bại. Hãy thử lại sau.");
    }
  };

  const handleStartGame = () => {
    if (!localStorage.getItem("currentUserId")) {
      toast.error("🚫 Không tìm thấy ID người dùng. Vui lòng đăng nhập lại!");
      navigate("/login");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      navigate("/loading");
    }, 2000);
  };

  return (
    <div className="auth-bg">
      {!isLoggedIn ? (
        <form className="auth-modal" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
          <p onClick={() => navigate("/register")} className="nav-link">
            Don't have an account? Sign up now
          </p>
        </form>
      ) : (
        <div className="auth-modal">
          <h2>Chào mừng bạn đã đăng nhập!</h2>
          {!isLoading ? (
            <button onClick={handleStartGame}>✨ Bắt đầu hành trình ✨</button>
          ) : (
            <p>Đang tải thế giới phép thuật... 🌀</p>
          )}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Login;