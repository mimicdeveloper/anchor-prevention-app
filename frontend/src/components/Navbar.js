import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

function Navbar() {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <header style={{ textAlign: 'center', margin: '20px 0' }}>
      <img
        src={`${process.env.PUBLIC_URL}/anchor-logo.png`}
        alt="Anchor Prevention Logo"
        style={{ maxHeight: '250px', marginBottom: '10px' }}
      />
      <nav style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '10px' }}>
        <Link to="/"><button>Home</button></Link>
        {!loggedIn && <Link to="/login"><button>Login</button></Link>}
        {!loggedIn && <Link to="/register"><button>Register</button></Link>}
        {loggedIn && <Link to="/forum"><button>Forum</button></Link>}
        {loggedIn && <Link to="/mood"><button>Mood Tracker</button></Link>}
        <Link to="/crisis-resources"><button>Crisis Help</button></Link>
        {loggedIn && <button onClick={handleLogout}>Logout</button>}
      </nav>
    </header>
  );
}

export default Navbar;
