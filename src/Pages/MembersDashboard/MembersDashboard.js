import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { search } from '../../Supabase/supabaseService';
import './MembersDashboard.css';


function MembersDashboard() {
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showNoMembersFound, setShowNoMembersFound] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();

        try {
            const searchResults = await search(searchTerm);
            setMembers(searchResults);

            // Show "No Members Found" if no results
            setShowNoMembersFound(searchResults.length === 0);
        } catch (error) {
            console.error(error);
        }
    };


    const handleClear = () => {
        setSearchTerm('');
        setMembers([]);
        setShowNoMembersFound(false); // Hide "No Members Found" on clear
    };

    return (
        <div className='card'>
            <div className='card-content'>
                <h2>Members Dashboard</h2>
                <div>
                    <input
                        className='search-input'
                        type="text"
                        placeholder="Search members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className='btn-container'>
                        <button className='btn' onClick={handleSearch}>Search</button>
                        <button className='btn' onClick={handleClear}>Clear</button>
                        <Link className='link-btn' to="/add-member">Add New Member</Link>
                    </div>
                </div>
                {members.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Date Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member) => (
                                <tr key={member.id}>
                                    <td>{member.firstName}</td>
                                    <td>{member.lastName}</td>
                                    <td>{member.email}</td>
                                    <td>{member.dateJoined}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : showNoMembersFound ? (
                    <p>No Members Found</p>
                ) : null}
            </div>
        </div>
    );
}

export default MembersDashboard;
