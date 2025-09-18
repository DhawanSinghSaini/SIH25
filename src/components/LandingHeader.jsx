import React from 'react';
import emblem from '../assets/logo.png'; 

function LandingHeader() {
  return (
    <header className="portal-header">
      <div className="header-content">
        <img src={emblem} alt="Government Emblem" className="emblem" />
        <h1>Government of India</h1>
        <h2>Official Portal</h2>
      </div>
    </header>
  );
}

export default LandingHeader;