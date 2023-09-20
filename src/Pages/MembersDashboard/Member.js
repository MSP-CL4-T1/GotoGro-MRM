import React, { useState } from 'react';
import './Member.css';
import { softDeleteMember, updateMember } from '../../Supabase/supabaseService';
import { useNavigate } from 'react-router-dom';
import TextInputWithValidation from '../../Components/TextInputWithValidation';

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
                    <div className='form-container'>
                        <div className='label-input'>
                            <strong>First Name:</strong><span className="required-star"> *</span>
                            <TextInputWithValidation
                                required={true}
                                value={editedFirstName}
                                regex={/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/}
                                regexErrorMsg="Invalid Character"
                                parentOnChange={setEditedFirstName}
                            />
                        </div>
                        <div className='label-input'>
                            <strong>Last Name:</strong><span className="required-star"> *</span>
                            <TextInputWithValidation
                                required={true}
                                value={editedLastName}
                                regex={/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/}
                                regexErrorMsg="Invalid Character"
                                parentOnChange={setEditedLastName}
                            />
                        </div>
                        <div className='label-input'>
                            <strong>Email:</strong><span className="required-star"> *</span>
                            <TextInputWithValidation
                                regex={/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/}
                                regexErrorMsg="Invalid Email"
                                value={editedEmail}
                                parentOnChange={setEditedEmail}
                                required={true}
                            />
                        </div>
                        <div className='label-input'>
                            <strong>Date Joined:</strong>
                            <TextInputWithValidation
                                value={member.date_joined}
                                readonly={true}
                            />
                        </div>
                    </div>
                    <div className='btn-container'>
                        <button onClick={handleSave}>Save</button>
                        <button onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            ) : (
                <div>
                    <div className='form-container'>
                        <div className='label-input'>
                            <strong>First Name:</strong>
                            <TextInputWithValidation
                                value={member.first_name}
                                readonly={true}
                            />
                        </div>
                        <div className='label-input'>
                            <strong>Last Name:</strong>
                            <TextInputWithValidation
                                value={member.last_name}
                                readonly={true}
                            />
                        </div>
                        <div className='label-input'>
                            <strong>Email:</strong>
                            <TextInputWithValidation
                                value={member.email}
                                readonly={true}
                            />
                        </div>
                        <div className='label-input'>
                            <strong>Date Joined:</strong>
                            <TextInputWithValidation
                                value={member.date_joined}
                                readonly={true}
                            />
                        </div>
                    </div>
                    <div className='btn-container'>
                        <button onClick={handleEdit}>Edit</button>
                        <button onClick={handleDelete}>Delete</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Member;
