import React from 'react';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import SignIn from './Pages/SignIn/SignIn';
import SignUp from './Pages/SignUp/SignUp';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/" exact element={<HomePage />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                </Routes>
                <footer>
                    <p>© 2023 Goto Grocery Inc. All rights reserved.</p>
                </footer>
            </div>
        </Router>
    );
}

const HomePage = () => {
    const navigateToDashboard = () => {
        console.log("Navigating to Members Dashboard...");
    };

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
                <button className="dashboard-button" onClick={navigateToDashboard}>
                    Go to Members Dashboard
                </button>
            </main>
        </div>
    );
}

export default App;
