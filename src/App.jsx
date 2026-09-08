import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import PlayerDashboard from './pages/PlayerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PlayQuiz from './pages/PlayQuiz';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/player" element={<PlayerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/play/:tournamentId" element={<PlayQuiz />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;