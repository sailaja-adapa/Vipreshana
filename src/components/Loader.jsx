import React from 'react';
import './Loader.css';

const Loader = () => {
  return (
    <div className="loader-container">
      <img src="/truck.gif" alt="loading" className="loader-gif" />
      <h1 className="loader-text">Vipreshana...</h1>
    </div>
  );
};

export default Loader;
