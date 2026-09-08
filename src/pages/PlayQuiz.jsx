import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

function PlayQuiz() {
    const { tournamentId } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchQuestions();
    }, []);

    async function fetchQuestions() {
        try {
            const response = await api.post(`/api/players/tournaments/${tournamentId}/play`);
            setQuestions(response.data);
        } catch (err) {
            setError('Could not load questions. You may have already played this tournament.');
        }
    }

    function handleAnswerChange(questionId, choice) {
        setAnswers({ ...answers, [questionId]: choice });
    }

    async function handleSubmit() {
        const answerList = Object.keys(answers).map((questionId) => ({
            questionId: parseInt(questionId),
            selectedAnswer: answers[questionId],
        }));

        try {
            const response = await api.post(`/api/players/tournaments/${tournamentId}/submit`, {
                answers: answerList,
            });
            setResult(response.data);
        } catch (err) {
            setError('Could not submit answers.');
        }
    }

    if (error) {
        return (
            <div className="page">
                <p className="error">{error}</p>
                <button onClick={() => navigate('/player')}>Back to Dashboard</button>
            </div>
        );
    }

    if (result) {
        return (
            <div className="page">
                <h2>Quiz Complete!</h2>
                <div className="card">
                    <h3>Score: {result.score} / {result.totalQuestions}</h3>
                </div>
                {result.feedback.map((f) => (
                    <div className="card" key={f.questionId}>
                        <p><strong>{f.questionText}</strong></p>
                        <p>Your answer: {f.selectedAnswer} — {f.correct ? '✅ Correct' : '❌ Incorrect'}</p>
                        {!f.correct && <p>Correct answer: {f.correctAnswer}</p>}
                    </div>
                ))}
                <button onClick={() => navigate('/player')}>Back to Dashboard</button>
            </div>
        );
    }

    return (
        <div className="page">
            <h2>Answer the Questions</h2>
            {questions.map((q) => (
                <div className="card" key={q.id}>
                    <p><strong>{q.questionText}</strong></p>
                    {q.choices.map((choice) => (
                        <label key={choice} style={{ display: 'block', fontWeight: 'normal' }}>
                            <input
                                type="radio"
                                name={`question-${q.id}`}
                                value={choice}
                                checked={answers[q.id] === choice}
                                onChange={() => handleAnswerChange(q.id, choice)}
                            />
                            {' '}{choice}
                        </label>
                    ))}
                </div>
            ))}
            {questions.length > 0 && <button onClick={handleSubmit}>Submit Answers</button>}
        </div>
    );
}

export default PlayQuiz;