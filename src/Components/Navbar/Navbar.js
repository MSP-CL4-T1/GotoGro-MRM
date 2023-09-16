import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    return (
        <nav className="navbar">
            <ul className="navbar-list">
                <li className="navbar-item logo">
                    <Link to="/" className="navbar-logo">
                        <img src="logo.png" alt="GotoGro Logo" />
                    </Link>
                </li>
                <li className="navbar-item">
                    <Link to="/signin" className="navbar-link">Sign In</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/signup" className="navbar-link">Sign Up</Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
