import React, { useEffect, useState } from 'react';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AddMember from './Pages/Members/AddMember';
import MembersHome from './Pages/Members/MembersHome';
import Member from './Pages/Members/Member';
import Reporting from './Pages/Reporting/Reporting';
import SalesReport from './Pages/Reporting/SalesReport';
import InventoryReport from './Pages/Reporting/InventoryReport';
import supabase from "./Supabase/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import ProductsHome from './Pages/Products/ProductsHome';
import AddProduct from './Pages/Products/AddProduct';

function App() {
    const [session, setSession] = useState(null);
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (!session) {
        return (
            <div className={"supabaseAuth"}>
                <img className='user-auth-logo' src="images/dark-logo.png" alt="GotoGro Logo" />
                <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
            </div>
        );
    } else {
        return (
            <Router>
                <div className="App">
                    <Navbar />
                    <Routes>
                        <Route path="/" exact element={<HomePage />} />
                        <Route path="/members-home" element={<MembersHome />} />
                        <Route path="/member" element={<Member />} />
                        <Route path="/add-member" element={<AddMember />} />
                        <Route path="/reporting" element={<Reporting />} />
                        <Route path="/sales-report" element={<SalesReport />} />
                        <Route path="/inventory-report" element={<InventoryReport />} />
                        <Route path="/products-home" element={<ProductsHome />} />
                        <Route path="/add-product" element={<AddProduct />} />
                    </Routes>
                    <footer>
                        <p>© 2023 Goto Grocery Inc. All rights reserved.</p>
                    </footer>
                </div>
            </Router>
        );
    }
}

const HomePage = () => {
    return (
        <div className="home-content">
            <header className="App-header">
                <h1>Welcome to GotoGro-MRM</h1>
            </header>
            <main>
                <p className="description">
                    Situated in the Hawthorn region, Goto Grocery operates as a member-centric grocery store
                    facing challenges in meeting its members' expectations and satisfying their diverse grocery needs.
                    We're excited to introduce our new digital Members Record Management System.
                </p>
                <Link className="main-button dashboard-button" to="/members-home">Go to Members Home</Link>
                <Link className="main-button dashboard-button" to="/products-home">Go to Products Home</Link>
                <Link className="main-button reporting-button" to="/reporting">Go to Reporting</Link>
            </main>
        </div>
    );
}

export default App;
