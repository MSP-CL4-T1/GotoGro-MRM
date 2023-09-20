import React, { useState } from 'react';
import TextInputWithValidation from '../../Components/TextInputWithValidation';
import { addMember } from '../../Supabase/supabaseService';
import { useNavigate } from 'react-router-dom';

function AddMember() {
    // State variables to store member information
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [dateJoined, setDateJoined] = useState('');
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    const navigate = useNavigate();

    const handleSave = async (e) => {
        e.preventDefault();
        setIsFormSubmitted(true);

        if (!firstName || !lastName || !email) {
            return;
        }

        // Get the current date and time (now)
        const currentDate = new Date();

        try {
            const newMember = {
                first_name: firstName,
                last_name: lastName,
                email: email,
                date_joined: dateJoined ? dateJoined : currentDate
            };

            await addMember(newMember);
            localStorage.setItem('selectedMember', JSON.stringify(newMember));
            navigate('/member');
        } catch (error) {
            console.error(error)
        }
    };

    const handleCancel = () => {
        navigate('/members-dashboard');
    }

    return (
        <div className="card">
            <h2>Add Member</h2>
            <form onSubmit={handleSave} className='form-container'>
                <div className="label-input">
                    <strong>First Name:</strong><span className="required-star"> *</span>
                    <TextInputWithValidation
                        value={firstName}
                        parentOnChange={setFirstName}
                        required={true}
                        regex={/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/}
                        regexErrorMsg="Invalid Character"
                        showError={isFormSubmitted}
                    />
                </div>
                <div className="label-input">
                    <strong>Last Name:</strong><span className="required-star"> *</span>
                    <TextInputWithValidation
                        value={lastName}
                        parentOnChange={setLastName}
                        required={true}
                        regex={/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/}
                        regexErrorMsg="Invalid Character"
                        showError={isFormSubmitted}
                    />
                </div>
                <div className="label-input">
                    <strong>Email:</strong><span className="required-star"> *</span>
                    <TextInputWithValidation
                        value={email}
                        parentOnChange={setEmail}
                        required={true}
                        regex={/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/}
                        regexErrorMsg="Invalid Email"
                        showError={isFormSubmitted}
                    />
                </div>
                <div className="label-input">
                    <strong>Date Joined:</strong>
                    <TextInputWithValidation
                        type='date'
                        value={dateJoined}
                        parentOnChange={setDateJoined}
                    />
                </div>
                <div className='btn-container'>
                    <button type="submit">Add Member</button>
                    <button type="cancel" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default AddMember;
