import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/api';  // Your login API helper

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ username, password });
      localStorage.setItem('access_token', response.data.access);
      setError(null);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '70vh',
        fontFamily: 'Poppins, sans-serif',
        padding: '0 20px',
      }}
    >
      <h2 style={{ marginBottom: '10px', color: 'black' }}>Login</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          width: '100%',
          maxWidth: '400px',
          backgroundColor: '#f0fafa',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
        }}
      >
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          style={{
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            fontSize: '1rem',
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            fontSize: '1rem',
          }}
        />
        <button
          type="submit"
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            fontSize: '1rem',
            color: '#fff',
            backgroundColor: '#299191',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 20px',
            cursor: 'pointer',
            transition: 'background 0.3s ease',
            boxShadow: '0 4px 8px rgba(41, 145, 145, 0.3)'
          }}
        >
          Login
        </button>
        {error && (
          <p style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>
            {error}
          </p>
        )}
      </form>
    </div>
  );
}

export default Login;
