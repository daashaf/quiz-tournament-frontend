import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        try {
            await api.post('/api/players/register', formData);
            setSuccess(true);
            setTimeout(() => navigate('/'), 1500);
        } catch (err) {
            if (err.response && err.response.data) {
                const messages = Object.values(err.response.data).join(', ');
                setError(messages);
            } else {
                setError('Registration failed');
            }
        }
    }

    return (
        <div className="page">
            <div className="card" style={{ maxWidth: 400, margin: '0 auto' }}>
                <h2>Register as Player</h2>
                {success && <p style={{ color: 'green' }}>Registered! Redirecting to login...</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Username</label>
                        <input name="username" value={formData.username} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} />
                    </div>
                    <div>
                        <label>First Name</label>
                        <input name="firstName" value={formData.firstName} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Last Name</label>
                        <input name="lastName" value={formData.lastName} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} />
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button type="submit">Register</button>
                </form>
                <p>Already have an account? <Link to="/">Login here</Link></p>
            </div>
        </div>
    );
}

export default Register;