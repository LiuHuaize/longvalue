import React from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Business from './pages/Business';
import Team from './pages/Team';
import Investor from './pages/Investor';
import Research from './pages/Research';
import About from './pages/About';
import './App.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/business" element={<Business />} />
            <Route path="/team" element={<Team />} />
            <Route path="/investor" element={<Investor />} />
            <Route path="/research" element={<Research />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
