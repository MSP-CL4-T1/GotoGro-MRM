import React from 'react';
import {Link} from 'react-router-dom';
import './Navbar.css';
import {signOut} from '../../Supabase/supabaseService';

function Navbar() {
	return (
		<nav className='navbar'>
			<ul className='navbar-list'>
				<li className='navbar-item logo'>
					<Link to='/' className='navbar-logo'>
						<img src='/images/logo.png' alt='GotoGro Logo' />
					</Link>
				</li>
				{/* Add sign-out button */}
				<li className='navbar-item'>
					<button onClick={signOut} className='navbar-link primary-btn'>
						Sign Out
					</button>
				</li>
			</ul>
		</nav>
	);
}

export default Navbar;
