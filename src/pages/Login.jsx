import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { login as saveLogin } from '../api/auth';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        saveLogin(username, password);

        try {
            const response = await api.get('/api/users/me');
            const role = response.data.role;
            localStorage.setItem('role', role);
            navigate(role === 'ADMIN' ? '/admin' : '/player');
        } catch (err) {
            setError('Invalid username or password');
            localStorage.removeItem('authHeader');
        }
    }

    return (
        <div className="page">
            <div className="card" style={{ maxWidth: 400, margin: '0 auto' }}>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Username</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div>
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button type="submit">Login</button>

                    <p>Don't have an account? <Link to="/register">Register here</Link></p>
                </form>
            </div>
        </div>
    );
}

export default Login;