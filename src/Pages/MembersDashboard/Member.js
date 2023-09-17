import React, { useState } from 'react';
import './Member.css';
import { softDeleteMember, updateMember } from '../../Supabase/supabaseService';
import { useNavigate } from 'react-router-dom';

/**
 * Member component for displaying member details and allowing edits.
 * @returns {JSX.Element} The rendered JSX element.
 */
function Member() {
    const [member, setMember] = useState(JSON.parse(localStorage.getItem('selectedMember')));
    const [isEditing, setIsEditing] = useState(false);
    const [editedFirstName, setEditedFirstName] = useState(member.first_name);
    const [editedLastName, setEditedLastName] = useState(member.last_name);
    const [editedEmail, setEditedEmail] = useState(member.email);

    const navigate = useNavigate();

    // turns the component into editing mode
    const handleEdit = () => {
        setIsEditing(true);
    };

    // cancels the changes and resets the values to original values
    const handleCancel = () => {
        setIsEditing(false);
        setEditedFirstName(member.first_name);
        setEditedLastName(member.last_name);
        setEditedEmail(member.email);
    };

    // saves the changes to the member by calling the updateMember function from supabaseService
    const handleSave = async () => {
        try {
            const updatedMember = {
                member_id: member.member_id,
                first_name: editedFirstName,
                last_name: editedLastName,
                email: editedEmail,
                date_joined: member.date_joined
            };

            await updateMember(updatedMember);
            setMember(updatedMember);
            setIsEditing(false);

        } catch (error) {
            console.error(error)
        }
    };

    // soft deletes the member and redirects the user to the MembersDashboard screen
    const handleDelete = async () => {
        try {
            await softDeleteMember(member);
            localStorage.removeItem('selectedMember');
            navigate('/members-dashboard');
        } catch (error) {
            console.error(error)
        }
    };

    return (
        <div className='card'>
            <h2>Member Details</h2>
            {isEditing ? (
                <div>
                    <label>
                        First Name:
                        <input
                            type="text"
                            value={editedFirstName}
                            onChange={(e) => setEditedFirstName(e.target.value)}
                        />
                    </label>
                    <label>
                        Last Name:
                        <input
                            type="text"
                            value={editedLastName}
                            onChange={(e) => setEditedLastName(e.target.value)}
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="text"
                            value={editedEmail}
                            onChange={(e) => setEditedEmail(e.target.value)}
                        />
                    </label>
                    <div className='btn-container'>
                        <button className='btn' onClick={handleSave}>Save</button>
                        <button className='btn' onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            ) : (
                <div >
                    <div className='view-container'>
                        <p>
                            <strong>First Name:</strong>
                            <span className='view-box'>{member.first_name}</span>
                        </p>
                        <p>
                            <strong>Last Name:</strong>
                            <span className='view-box'>{member.last_name}</span>
                        </p>
                        <p>
                            <strong>Email:</strong>
                            <span className='view-box'>{member.email}</span>
                        </p>
                        <p>
                            <strong>Date Joined:</strong>
                            <span className='view-box'>{member.date_joined}</span>
                        </p>
                    </div>
                    <div className='btn-container'>
                        <button className='btn' onClick={handleEdit}>Edit</button>
                        <button className='btn' onClick={handleDelete}>Delete</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Member;
