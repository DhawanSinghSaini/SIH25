import React from 'react';
import '../styles/LandingPage.css';
import Header from '../components/LandingHeader';
import LoginPage from '../components/LoginPage';
import Footer from '../components/LandingFooter';

function LandingPage({ onLogin }) {
  return (
    <div className="portal-container">
      <Header />
      <main className="main-content">
        
        {/* 👇 ADD THIS LINE FOR THE SLOGAN 👇 */}
        <h2 className="portal-slogan">"Honoring Traditions, Empowering Futures."</h2>

        <LoginPage onLogin={onLogin} />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;