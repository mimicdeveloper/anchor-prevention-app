import React, { useState, useEffect } from 'react';
import api from '../api/api';

function MoodTracker() {
  const [moodEntries, setMoodEntries] = useState([]);
  const [note, setNote] = useState('');
  const [mood, setMood] = useState('neutral');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const response = await api.get('/mood-entries/');
        setMoodEntries(response.data);
        setError(null);
      } catch {
        setError('Failed to load mood entries');
      }
    };
    fetchMoods();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/mood-entries/', { note, mood });
      setNote('');
      setMood('neutral');
      const response = await api.get('/mood-entries/');
      setMoodEntries(response.data);
      setError(null);
    } catch {
      setError('Failed to add mood entry');
    }
  };

  const ratingLevels = {
    happy: '😊',
    sad: '😢',
    anxious: '😰',
    angry: '😠',
    neutral: '😐',
    other: '🤔',
  };

  return (
    <>
      {/* Sentiment key explanation - OUTSIDE main box */}
      <div
        style={{
          backgroundColor: '#e0f7f7',
          borderRadius: '6px',
          padding: '12px 20px',
          margin: '40px auto 20px auto',
          maxWidth: '500px',
          fontSize: '.9rem',
          color: '#145454',
          border: '1.5px solid #299191',
          lineHeight: 1.6,
          fontWeight: '500',
          letterSpacing: '0.02em',
          textAlign: 'center',
        }}
      >
        <strong style={{ display: 'block', marginBottom: '8px' }}>Sentiment Key:</strong>
        <p style={{ margin: '4px 0' }}>
          Sentiment scores range from <em>-1</em> (very negative) to <em>+1</em> (very positive).
        </p>
        <p style={{ margin: '4px 0' }}>
          A score near <em>0</em> indicates a neutral sentiment.
        </p>
      </div>

      {/* Main tracker box */}
      <div
        style={{
          maxWidth: '700px',
          margin: '0 auto',
          padding: '20px',
          backgroundColor: '#f8ffff',
          borderRadius: '10px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        <h2 style={{ color: '#299191', marginBottom: '10px' }}>Mood Tracker</h2>

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: '10px' }}>
            Mood:
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              required
              style={{
                display: 'block',
                width: '100px',
                padding: '10px',
                fontSize: '1rem',
                borderRadius: '6px',
                border: '1px solid #ccc',
                marginTop: '5px',
                marginBottom: '15px',
              }}
            >
              <option value="happy">Happy</option>
              <option value="sad">Sad</option>
              <option value="anxious">Anxious</option>
              <option value="angry">Angry</option>
              <option value="neutral">Neutral</option>
              <option value="other">Other</option>
            </select>
          </label>

          <textarea
            placeholder="How are you feeling today?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            required
            rows={6}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '1rem',
              border: '1px solid #ccc',
              borderRadius: '6px',
              marginBottom: '15px',
              resize: 'none',
              height: '150px',
              display: 'block',
              boxSizing: 'border-box',
            }}
          />

          <button
            type="submit"
            style={{
              backgroundColor: '#299191',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 20px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
              marginTop: '15px',
              marginBottom: '20px',
            }}
          >
            Add Entry
          </button>
        </form>

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

        <h3 style={{ marginTop: '30px', color: '#333' }}>Your Mood Entries</h3>
        {moodEntries.length === 0 ? (
          <p style={{
            color: '#888',
            textAlign: 'center',
            fontStyle: 'italic',
            marginTop: '20px'
          }}>
            No mood entries yet. Share your thoughts!
          </p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {moodEntries.map((entry) => (
              <li
                key={entry.id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '6px',
                  padding: '15px',
                  marginBottom: '10px',
                  borderLeft: '5px solid #299191',
                }}
              >
                <p style={{ marginBottom: '8px' }}>{entry.note}</p>
                <small style={{ color: '#666' }}>
                  Mood: <strong>{ratingLevels[entry.mood] || '❓'} {entry.mood}</strong> — Date:{' '}
                  {new Date(entry.timestamp).toLocaleString()} — Sentiment:{' '}
                  <strong>{entry.sentiment.toFixed(2)}</strong>
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default MoodTracker;
