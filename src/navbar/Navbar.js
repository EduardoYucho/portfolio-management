import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <div className="navbar">
      <Link to="/">Início</Link>
      <Link to="/project-list">Projetos</Link>
      <Link to="/person-list">Pessoas</Link>
    </div>
  );
};

export default Navbar;
