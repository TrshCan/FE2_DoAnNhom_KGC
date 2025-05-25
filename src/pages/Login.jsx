import '../assets/css/AuthModal.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BASE_URL from '../components/BaseURL';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Kiểm tra trạng thái đăng nhập khi component mount
    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch(`/api/check-session.php`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                if (data.loggedIn) {
                    setIsLoggedIn(true);
                    setIsLoading(true);
                    toast.success('🧙‍♂️ Bạn đã đăng nhập! Chuyển đến trang chính...');
                    // Kiểm tra role từ session hoặc API
                    const role = data.role || 'user'; // Giả sử API check-session trả về role
                    setTimeout(() => {
                        navigate(role === 'admin' ? '/admin' : '/mainhall');
                    }, 2000);
                }
            } catch (err) {
                console.error('Error checking session:', err);
                toast.error('❌ Kết nối đến máy chủ thất bại.');
            }
        };
        checkSession();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            toast.error('📛 Email không hợp lệ!');
            return;
        }

        try {
            const response = await fetch(`/api/login.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include',
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            if (data.success) {
                setIsLoggedIn(true);
                toast.success('🧙‍♂️ Đăng nhập thành công! Cổng phép thuật đã mở...', {
                    position: 'top-center',
                    autoClose: 3000,
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
                setIsLoading(true);
                // Chuyển hướng dựa trên role
                const redirectPath = data.role === 'admin' ? '/admin' : '/mainhall';
                setTimeout(() => {
                    navigate(redirectPath);
                }, 1000);
            } else {
                toast.error(`🚫 ${data.message}`);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('❌ Kết nối đến máy chủ thất bại. Hãy thử lại sau.');
        }
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
                    <p onClick={() => navigate('/register')} className="nav-link">
                        Don't have an account? Sign up now
                    </p>
                </form>
            ) : (
                <div className="auth-modal">
                    <h2>Chào mừng bạn đã đăng nhập!</h2>
                    {!isLoading ? (
                        <button onClick={() => navigate('/mainhall')}>
                            ✨ Bắt đầu hành trình ✨
                        </button>
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