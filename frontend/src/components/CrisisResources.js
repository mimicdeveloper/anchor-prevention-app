import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CrisisResources() {
  const [resources, setResources] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/crisis-resources/');
        setResources(response.data);
      } catch (err) {
        setError('Failed to load crisis resources.');
      }
    };

    fetchResources();
  }, []);

  return (
    <div
      style={{
        maxWidth: '700px',
        margin: '40px auto',
        padding: '20px',
        backgroundColor: '#f8ffff',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <h2 style={{ color: '#299191', marginBottom: '20px' }}>Crisis Resources</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {resources.length === 0 && !error && <p>Loading resources...</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {resources.map((resource) => (
          <li
            key={resource.id}
            style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              padding: '15px 20px',
              marginBottom: '15px',
              borderLeft: '5px solid #299191',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
            }}
          >
            <h3 style={{ margin: '0 0 10px 0', color: '#145454' }}>{resource.name}</h3>
            <p style={{ margin: '0 0 8px 0', fontSize: '0.95rem', lineHeight: 1.5 }}>
              {resource.description}
            </p>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              📞 <a href={`tel:${resource.phone}`} style={{ color: '#299191' }}>{resource.phone}</a><br />
              🌐 <a href={resource.website} target="_blank" rel="noopener noreferrer" style={{ color: '#299191' }}>
                Visit Website
              </a>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CrisisResources;
