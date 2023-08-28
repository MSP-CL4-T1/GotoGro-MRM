import React from 'react';
import './App.css';

function App() {
  const navigateToDashboard = () => {
    console.log("Navigating to Members Dashboard...");
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to GotoGro-MRM</h1>
      </header>
      <main>
        <p>
          Situated in the Hawthorn region, Goto Grocery operates as a member-centric grocery store 
          facing challenges in meeting its members' expectations and satisfying their diverse grocery needs.
          We're excited to introduce our new digital Members Record Management System.
        </p>
        <button onClick={navigateToDashboard}>Go to Members Dashboard</button>
      </main>
      <footer>
        <p>© 2023 Goto Grocery Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
