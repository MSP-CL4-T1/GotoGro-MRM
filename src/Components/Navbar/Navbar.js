import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

/**
 * Navbar component for navigation.
 * @returns {JSX.Element} The rendered JSX element.
 */
function Navbar() {
    return (
        <nav className="navbar">
            <ul className="navbar-list">
                <li className="navbar-item logo">
                    <Link to="/" className="navbar-logo">
                        <img src="images/logo.png" alt="GotoGro Logo" />
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
