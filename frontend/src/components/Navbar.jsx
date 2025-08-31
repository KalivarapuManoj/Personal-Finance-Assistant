import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand">Personal Finance</div>
        <nav className="nav-links">
          <NavLink to="/" end className="navlink">Home</NavLink>
          <NavLink to="/summary" className="navlink">Summary</NavLink>
        </nav>
      </div>
    </header>
  );
}
