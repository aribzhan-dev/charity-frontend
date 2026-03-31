import React from 'react';
import Nav from '../components/Nav';

const NotFound = () => {
  return (
    <div>
      <Nav />
      <div className="container" style={{ textAlign: 'center', marginTop: '10rem' }}>
        <h1 style={{ fontSize: '4rem', color: '#ccc' }}>404</h1>
        <p>Page Not Found</p>
      </div>
    </div>
  );
};

export default NotFound;
