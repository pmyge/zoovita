import React from 'react';
import { ShieldCheck, Download, ChevronRight, PawPrint } from 'lucide-react';
import './App.css';
import heroImage from './assets/hero_image.png';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="container nav-container">
        <div className="logo-section">
          <PawPrint size={28} color="#3C8E2D" className="logo-icon" />
          <span className="logo-text">Zoovita</span>
        </div>
        
        <div className="nav-links">
          <a href="#" className="nav-link active">Bosh sahifa</a>
          <a href="#" className="nav-link">Imkoniyatlar</a>
          <a href="#" className="nav-link">AI Yordamchi</a>
          <a href="#" className="nav-link">Veterinariya</a>
          <a href="#" className="nav-link">E'lonlar</a>
          <a href="#" className="nav-link">Biz haqimizda</a>
        </div>
        
        <div className="nav-actions">
          <button className="download-btn">
            Ilovani yuklab olish
          </button>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="container hero-container">
        
        {/* Left Content */}
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="text-primary">Zoovita</span> — O'zbekistondagi hayvonlar va chorvachilik uchun yagona raqamli ekotizim
          </h1>
          <p className="hero-subtitle">
            Sotish, sotib olish, veterinariya xizmatlari va AI tavsiyalar — barchasi bitta ilovada.
          </p>
          
          <div className="store-buttons">
            <button className="store-btn play-store">
              <div className="store-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 3.01l11.5 11.5-3.35 3.35-8.15-8.15zM16.5 15.5l3.5-3.5-3.5-3.5L13.15 12zM5.5 21L12 14.5l3 3-9.5 3.5zM5.5 3l9.5 3.5-3 3L5.5 3z"/></svg>
              </div>
              <div className="store-text">
                <span className="store-small">GET IT ON</span>
                <span className="store-large">Google Play</span>
              </div>
            </button>
            <button className="store-btn app-store">
              <div className="store-icon">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.5 4.5c.8-1 1.4-2.5 1.2-4-.5 0-2 .3-3.2 1.2-.8.8-1.5 2.2-1.3 3.8.5 0 2-.2 3.3-1zM16.8 24c-1.5 0-3-1-4.2-1-1.3 0-2.8 1-4.3 1-3.5 0-7-4.5-8.3-9-.8-2.5-1-6 1.5-8.2 1-.8 2.5-1.5 4-1.5 1.5 0 3 1 4.2 1 1 0 3-1 4.5-1 1.8 0 3.2.5 4.5 1.8-1.5 1.2-2.5 3-2.5 5 0 2.2 1.8 4 3.5 4.5-1.5 3.5-3.5 6.5-5 6.5-.5.2-1.3 0-2-.2z"/></svg>
              </div>
              <div className="store-text">
                <span className="store-small">Download on the</span>
                <span className="store-large">App Store</span>
              </div>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <ShieldCheck size={20} color="#3C8E2D" />
              </div>
              <div>
                <div className="stat-value">10,000+</div>
                <div className="stat-label">e'lonlar</div>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" color="#3C8E2D"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div>
                <div className="stat-value">2,000+</div>
                <div className="stat-label">foydalanuvchilar</div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" color="#3C8E2D"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
              </div>
              <div>
                <div className="stat-value">50+</div>
                <div className="stat-label">veterinarlar</div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" color="#3C8E2D"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              </div>
              <div>
                <div className="stat-value">500+</div>
                <div className="stat-label">sotuvchilar</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Image */}
        <div className="hero-image-wrapper">
          <img src={heroImage} alt="Zoovita Mobile App and Animals" className="hero-image" />
        </div>
      </div>
    </section>
  );
}

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <Hero />
    </div>
  );
}

export default App;
