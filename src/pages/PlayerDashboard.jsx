import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { logout } from '../api/auth';

function PlayerDashboard() {
    const [status, setStatus] = useState('ongoing');
    const [tournaments, setTournaments] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchTournaments();
    }, [status]);

    async function fetchTournaments() {
        setError('');
        try {
            const response = await api.get(`/api/players/tournaments?status=${status}`);
            setTournaments(response.data);
        } catch (err) {
            setError('Could not load tournaments');
        }
    }

    async function handleLike(tournamentId) {
        await api.post(`/api/players/tournaments/${tournamentId}/like`);
        alert('Liked!');
    }

    async function handleUnlike(tournamentId) {
        await api.delete(`/api/players/tournaments/${tournamentId}/like`);
        alert('Unliked!');
    }

    function handleLogout() {
        logout();
        navigate('/');
    }

    return (
        <div className="page">
            <h2>Player Dashboard</h2>
            <button onClick={handleLogout} style={{ marginBottom: '1rem' }}>Logout</button>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                {['ongoing', 'upcoming', 'past', 'participated'].map((s) => (
                    <button
                        key={s}
                        onClick={() => setStatus(s)}
                        style={{ backgroundColor: status === s ? '#2b6cb0' : '#a0aec0' }}
                    >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                ))}
            </div>

            {error && <p className="error">{error}</p>}

            <div className="tournament-list">
                {tournaments.length === 0 && <p>No tournaments found.</p>}
                {tournaments.map((t) => (
                    <div className="card" key={t.id}>
                        <h3>{t.name}</h3>
                        <p>Category: {t.category} | Difficulty: {t.difficulty}</p>
                        <p>Starts: {new Date(t.startDate).toLocaleString()}</p>
                        <p>Ends: {new Date(t.endDate).toLocaleString()}</p>
                        <p>Min passing score: {t.minPassingScore}%</p>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {status === 'ongoing' && (
                                <button onClick={() => navigate(`/play/${t.id}`)}>Play</button>
                            )}
                            <button onClick={() => handleLike(t.id)}>Like</button>
                            <button onClick={() => handleUnlike(t.id)}>Unlike</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PlayerDashboard;