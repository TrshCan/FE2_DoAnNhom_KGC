import '../assets/css/AuthModal.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BASE_URL from '../components/BaseURL';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!/^\S+@\S+\.\S+$/.test(formData.email)) return alert("Invalid email format.");
        if (formData.password !== formData.confirmPassword) return alert("Passwords don't match.");

        fetch(`${BASE_URL}/src/includes/register.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    toast.success('🧝‍♀️ Đăng ký thành công! Bạn đã được ghi danh vào Vương quốc!', {
                        position: 'top-center',
                        autoClose: 3000,
                        style: {
                            backgroundColor: '#009688',
                            color: '#ffffff',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            borderRadius: '12px',
                            boxShadow: '0 0 10px #00ffc8',
                        },
                        icon: '📜',
                    });
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                } else {
                    toast.error(`🚫 ${data.message}`);
                }
            });

    };

    return (
        <div className="auth-bg">
            <form className="auth-modal" onSubmit={handleSubmit}>
                <h2>Register</h2>
                <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                <input type="password" name="confirmPassword" placeholder="Re-enter Password" value={formData.confirmPassword} onChange={handleChange} required />
                <button type="submit">Sign Up</button>
                <p onClick={() => navigate('/login')} className="nav-link">Already signed up? Log in now</p>
            </form>
            <ToastContainer/>
        </div>
    );
};

export default Register;
