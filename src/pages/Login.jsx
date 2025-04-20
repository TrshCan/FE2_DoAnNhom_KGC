import '../assets/css/AuthModal.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../components/BaseURL'

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            alert('Invalid email format.');
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/src/includes/login.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                navigate('/mainhall');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            alert('Failed to connect to the server. Please try again later.');
        }
    };

    return (
        <div className="auth-bg">
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
        </div>
    );
};

export default Login;