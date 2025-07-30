import React from 'react';

function Footer() {
  return (
    <footer
      style={{
        textAlign: 'center',
        padding: '12px 0',
        backgroundColor: '#299191',
        color: 'white',
        fontSize: '0.9rem',
        position: 'fixed',
        bottom: 0,
        width: '100%',
        boxShadow: '0 -2px 5px rgba(0,0,0,0.1)',
        fontFamily: 'Poppins, sans-serif',
        userSelect: 'none',
      }}
    >
      &copy; 2025 Anchor Prevention
    </footer>
  );
}

export default Footer;
