import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { logout } from '../api/auth';

function AdminDashboard() {
    const [tournaments, setTournaments] = useState([]);
    const [likesMap, setLikesMap] = useState({});
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchTournaments();
    }, []);

    async function fetchTournaments() {
        setError('');
        try {
            const response = await api.get('/api/admin/tournaments');
            setTournaments(response.data);
        } catch (err) {
            setError('Could not load tournaments');
        }
    }

    async function fetchLikes(tournamentId) {
        const response = await api.get(`/api/admin/tournaments/${tournamentId}/likes`);
        setLikesMap({ ...likesMap, [tournamentId]: response.data.likesCount });
    }

    async function handleDelete(tournamentId) {
        const confirmed = window.confirm('Are you sure you want to delete this tournament? This cannot be undone.');
        if (!confirmed) return;

        try {
            await api.delete(`/api/admin/tournaments/${tournamentId}`);
            fetchTournaments();
        } catch (err) {
            setError('Could not delete tournament');
        }
    }

    function handleLogout() {
        logout();
        navigate('/');
    }

    return (
        <div className="page">
            <h2>Admin Dashboard</h2>
            <button onClick={handleLogout} style={{ marginBottom: '1rem' }}>Logout</button>

            {error && <p className="error">{error}</p>}

            <div className="tournament-list">
                {tournaments.length === 0 && <p>No tournaments found.</p>}
                {tournaments.map((t) => (
                    <div className="card" key={t.id}>
                        <h3>{t.name}</h3>
                        <p>Category: {t.category} | Difficulty: {t.difficulty}</p>
                        <p>Created by: {t.createdByUsername}</p>
                        <p>Starts: {new Date(t.startDate).toLocaleString()}</p>
                        <p>Ends: {new Date(t.endDate).toLocaleString()}</p>
                        {likesMap[t.id] !== undefined && <p>Likes: {likesMap[t.id]}</p>}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => fetchLikes(t.id)}>View Likes</button>
                            <button className="danger" onClick={() => handleDelete(t.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminDashboard;