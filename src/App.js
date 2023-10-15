import React, {useEffect, useState} from 'react';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import AddMember from './Pages/Members/AddMember';
import MembersHome from './Pages/Members/MembersHome';
import Member from './Pages/Members/Member';
import Reporting from './Pages/Reporting/Reporting';
import SalesReport from './Pages/Reporting/SalesReport';
import InventoryReport from './Pages/Reporting/InventoryReport';
import supabase from './Supabase/supabaseClient';
import {Auth} from '@supabase/auth-ui-react';
import {ThemeSupa} from '@supabase/auth-ui-shared';
import ProductsDashboard from './Pages/ProductsDashboard/ProductsDashboard';
import SalesDashboard from './Pages/SalesDashboard/SalesDashboard';
import ProductsHome from './Pages/Products/ProductsHome';
import AddProduct from './Pages/Products/AddProduct';
import Product from './Pages/Products/Product';
import SaleRecordsHome from './Pages/SaleRecords/SaleRecordsHome';
import SaleRecord from './Pages/SaleRecords/SaleRecord';
import AddSaleRecord from './Pages/SaleRecords/AddSaleRecord';

import particlesConfig from './particlesjs-config.json';

function App() {
	const [session, setSession] = useState(null);
	useEffect(() => {
		supabase.auth.getSession().then(({data: {session}}) => {
			setSession(session);
		});

		const {
			data: {subscription},
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});

		return () => subscription.unsubscribe();
	}, []);

	if (!session) {
		return (
			<div className={'supabaseAuth'}>
				<img className='user-auth-logo' src='images/dark-logo.png' alt='GotoGro Logo' />
				<Auth supabaseClient={supabase} appearance={{theme: ThemeSupa}} />
			</div>
		);
	}

	return (
		<Router>
			<div className='App'>
				<Navbar />
				<Routes>
					<Route path='/' exact element={<HomePage />} />
					<Route path='/products-dashboard' element={<ProductsDashboard />} />
					<Route path='/sales-dashboard' element={<SalesDashboard />} />
					<Route path='/members-home' element={<MembersHome />} />
					<Route path='/member' element={<Member />} />
					<Route path='/add-member' element={<AddMember />} />
					<Route path='/reporting' element={<Reporting />} />
					<Route path='/sales-report' element={<SalesReport />} />
					<Route path='/inventory-report' element={<InventoryReport />} />
					<Route path='/products-home' element={<ProductsHome />} />
					<Route path='/add-product' element={<AddProduct />} />
					<Route path='/product' element={<Product />} />
					<Route path='/sale-records-home' element={<SaleRecordsHome />} />
					<Route path='/sale-records' element={<SaleRecord />} />
					<Route path='/add-sale-record' element={<AddSaleRecord />} />
				</Routes>
				<footer>
					<p>© 2023 Goto Grocery Inc. All rights reserved.</p>
				</footer>
			</div>

		</Router>
	);
}

// Modify the HomePage component to create a dashboard with large buttons
const HomePage = () => {
	useEffect(() => {
		if (window.particlesJS) {
			window.particlesJS('particles-js', particlesConfig);
		}
	}, []);

	return (
		<div className='dashboard'>
			<div id='particles-js'></div>
			<div className='button-container'>
				<div className='button-row'>
					<Link className='dashboard-button button-members' to='/members-home'>
						<div className='button-content'>
							<h2>Members</h2>
						</div>
					</Link>
					<Link className='dashboard-button' to='/products-home'>
						<div className='button-content'>
							<h2>Products</h2>
						</div>
					</Link>
					<Link className='dashboard-button' to='/sale-records-home'>
						<div className='button-content'>
							<h2>Sale Records</h2>
						</div>
					</Link>
				</div>
				<div className='button-row'>
					<Link className='dashboard-button' to='/sales-report'>
						<div className='button-content'>
							<h2>Sales Report</h2>
						</div>
					</Link>
					<Link className='dashboard-button' to='/inventory-report'>
						<div className='button-content'>
							<h2>Inventory Report</h2>
						</div>
					</Link>
				</div>
				<div className='button-row'>
					<Link className='dashboard-button' to='/products-dashboard'>
						<div className='button-content'>
							<h2>Products Dashboard</h2>
						</div>
					</Link>
					<Link className='dashboard-button button-sales-dashboard' to='/sales-dashboard'>
						<div className='button-content'>
							<h2>Sales Dashboard</h2>
						</div>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default App;
