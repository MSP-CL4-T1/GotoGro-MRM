import React, { useState } from 'react';
import { TextInputWithValidation, validateInput } from '../../Components/TextInputWithValidation';
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

        const firstNameError = validateInput(firstName, true, /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/, "Invalid Character");
        const lastNameError = validateInput(lastName, true, /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/, "Invalid Character");
        const emailError = validateInput(email, true, /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, "Invalid Email");

        if (firstNameError || lastNameError || emailError) {
            return;
        }

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
        navigate('/members-home');
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
                        testid="first-name-input"
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
                        testid="last-name-input"
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
                        testid="email-input"
                    />
                </div>
                <div className="label-input">
                    <strong>Date Joined:</strong>
                    <TextInputWithValidation
                        type='date'
                        value={dateJoined}
                        parentOnChange={setDateJoined}
                        testid="date-joined-input"
                    />
                </div>
                <div className='btn-container'>
                    <button type="submit" data-testid="add-button">Add Member</button>
                    <button type="cancel" data-testid="cancel-button" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default AddMember;
