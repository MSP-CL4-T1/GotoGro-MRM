import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { searchMembersByName } from '../../Supabase/supabaseService';
import './MembersDashboard.css';

/**
 * MembersDashboard component for displaying and searching members.
 * @returns {JSX.Element} The rendered JSX element.
 */
function MembersDashboard() {
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showNoMembersFound, setShowNoMembersFound] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Handles the search for members.
     * @param {Event} e - The event object.
     */
    const handleSearch = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            const searchResults = await searchMembersByName(searchTerm);
            setMembers(searchResults);

            // Show "No Members Found" if no results
            setShowNoMembersFound(searchResults.length === 0);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Saves the selected member to local storage to retrieve it later in Member component
     * @param member - The selected Member
     */
    const saveSelectedMemberToLocalStorage = (member) => {
        localStorage.setItem('selectedMember', JSON.stringify(member));
    };

    /**
     * Clears the search and member list.
     */
    const handleClear = () => {
        setSearchTerm('');
        setMembers([]);
        setShowNoMembersFound(false); // Hide "No Members Found" on clear
    };

    return (
        <div className='card'>
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
            {isLoading ? (
                <p>Loading...</p>
            ) : members.length > 0 ? (
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
                            <tr key={member.member_id}>
                                <td><Link
                                    key={member.member_id}
                                    to={'/member'}
                                    onClick={() => { saveSelectedMemberToLocalStorage(member); }}
                                >{member.first_name}</Link></td>
                                <td><Link
                                    key={member.member_id}
                                    to={'/member'}
                                    onClick={() => { saveSelectedMemberToLocalStorage(member); }}
                                >{member.last_name}</Link></td>
                                <td><Link
                                    key={member.member_id}
                                    to={'/member'}
                                    onClick={() => { saveSelectedMemberToLocalStorage(member); }}
                                >{member.email}</Link></td>
                                <td><Link
                                    key={member.member_id}
                                    to={'/member'}
                                    onClick={() => { saveSelectedMemberToLocalStorage(member); }}
                                >{member.date_joined}</Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : showNoMembersFound ? (
                <p>No Members Found</p>
            ) : null}
        </div>
    );
}

export default MembersDashboard;
