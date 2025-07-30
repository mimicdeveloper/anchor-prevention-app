import React from 'react';

function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px', padding: '0 20px' }}>
      <p>Your mental health matters. Use the navigation above to get started.</p>
      <div
        style={{
          marginTop: '30px',
          backgroundColor: '#b2d8d8', // softer teal, closer to #299191
          borderRadius: '8px',
          padding: '20px',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto',
          boxShadow: '0 4px 8px rgba(41, 145, 145, 0.2)',
          color: '#204e4e',
          fontSize: '1rem',
          fontWeight: '500',
          lineHeight: '1.4',
        }}
      >
        <strong>Disclaimer:</strong> This app is designed to support your mental health but does not replace professional care. If you or someone you know is struggling, please seek help from a qualified healthcare provider.
      </div>
    </div>
  );
}

export default Home;
