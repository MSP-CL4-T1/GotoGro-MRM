import React from 'react';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import SignIn from './Pages/SignIn/SignIn';
import SignUp from './Pages/SignUp/SignUp';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AddMember from './Pages/MembersDashboard/AddMember';
import MembersDashboard from './Pages/MembersDashboard/MembersDashboard';
import Member from './Pages/MembersDashboard/Member';

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/" exact element={<HomePage />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/members-dashboard" element={<MembersDashboard />} />
                    <Route path="/member" element={<Member />} />
                    <Route path="/add-member" element={<AddMember />} />
                </Routes>
                <footer>
                    <p>© 2023 Goto Grocery Inc. All rights reserved.</p>
                </footer>
            </div>
        </Router>
    );
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
                <Link className="dashboard-button" to="/members-dashboard">Go to Members Dashboard</Link>
            </main>
        </div>
    );
}

export default App;
