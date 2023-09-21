import React from 'react';
import { Link } from 'react-router-dom';

function Reporting() {
    return (
        <div className="reporting-content">
            <header>
                <h2>Reporting Dashboard</h2>
            </header>
            <main>
                <Link className="sales-report-button" to="/sales-report">Go to Sales Report</Link>
                <Link className="inventory-report-button" to="/inventory-report">Go to Inventory Report</Link>
            </main>
        </div>
    );
}

export default Reporting;
