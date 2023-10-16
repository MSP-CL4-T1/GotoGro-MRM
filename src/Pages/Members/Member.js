import React, {useState, useEffect} from 'react';
import {updateMember} from '../../Supabase/supabaseService';
import {useNavigate} from 'react-router-dom';
import TextInputWithValidation from '../../Components/TextInputWithValidation';
import {validateInput} from '../../utils';

/**
 * Member component for displaying member details and allowing edits.
 * @returns {JSX.Element} The rendered JSX element.
 */
function Member() {
	const [member, setMember] = useState(JSON.parse(localStorage.getItem('selectedMember')));
	const [isEditing, setIsEditing] = useState(JSON.parse(localStorage.getItem('editingMember')));
	const [editedFirstName, setEditedFirstName] = useState(member.first_name);
	const [editedLastName, setEditedLastName] = useState(member.last_name);
	const [editedEmail, setEditedEmail] = useState(member.email);

	const [firstNameError, setFirstNameError] = useState(validateInput(editedFirstName, true, /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/, 'Invalid Character'));
	const [lastNameError, setLastNameError] = useState(validateInput(editedLastName, true, /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/, 'Invalid Character'));
	const [emailError, setEmailError] = useState(validateInput(editedEmail, true, /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, 'Invalid Email'));

	const navigate = useNavigate();

	// Turns the component into editing mode
	const handleEdit = () => {
		setIsEditing(true);
	};

	// Cancels the changes and resets the values to original values
	const handleCancel = () => {
		setIsEditing(false);
		setEditedFirstName(member.first_name);
		setEditedLastName(member.last_name);
		setEditedEmail(member.email);
	};

	// Saves the changes to the member by calling the updateMember function from supabaseService
	const handleSave = async e => {
		e.preventDefault();

		if (firstNameError || lastNameError || emailError) {
			return;
		}

		try {
			const updatedMember = {
				member_id: member.member_id,
				first_name: editedFirstName,
				last_name: editedLastName,
				email: editedEmail,
				date_joined: member.date_joined,
			};

			await updateMember(updatedMember);
			setMember(updatedMember);
			setIsEditing(false);
		} catch (error) {
			console.error(error);
		}
	};

	// Use useEffect to calculate validation errors as the inputs change
	useEffect(() => {
		setFirstNameError(
			validateInput(editedFirstName, true, /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/, 'Invalid Character'),
		);
	}, [editedFirstName]);

	useEffect(() => {
		setLastNameError(
			validateInput(editedLastName, true, /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/, 'Invalid Character'),
		);
	}, [editedLastName]);

	useEffect(() => {
		setEmailError(
			validateInput(editedEmail, true, /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, 'Invalid Email'),
		);
	}, [editedEmail]);

	return (
		<div className='card'>
			<h2>Member Details</h2>
			{isEditing ? (
				<div>
					<div className='form-container'>
						<TextInputWithValidation
							label='First Name:'
							value={editedFirstName}
							onChange={setEditedFirstName}
							required={true}
							error={firstNameError}
							testid='first-name-input'
						/>
						<TextInputWithValidation
							label='Last Name:'
							value={editedLastName}
							onChange={setEditedLastName}
							required={true}
							error={lastNameError}
							testid='last-name-input'
						/>
						<TextInputWithValidation
							label='Email:'
							value={editedEmail}
							onChange={setEditedEmail}
							required={true}
							error={emailError}
							testid='email-input'
						/>
						<TextInputWithValidation
							label='Date Joined:'
							value={member.date_joined}
							readonly={true}
							testid='date-joined-input'
						/>
					</div>
					<div className='btn-container'>
						<button className='secondary-btn' onClick={handleSave} data-testid='save-button'>Save</button>
						<button className='tertiary-btn' onClick={handleCancel} data-testid='cancel-button'>Cancel</button>
					</div>
				</div>
			) : (
				<div>
					<div className='form-container'>
						<TextInputWithValidation
							label='First Name:'
							value={member.first_name}
							readonly={true}
						/>
						<TextInputWithValidation
							label='Last Name:'
							value={member.last_name}
							readonly={true}
						/>
						<TextInputWithValidation
							label='Email:'
							value={member.email}
							readonly={true}
						/>
						<TextInputWithValidation
							label='Date Joined:'
							value={member.date_joined}
							readonly={true}
						/>
					</div>
					<div className='btn-container'>
						<button className='tertiary-btn' onClick={() => navigate('/members-home')} data-testid='back-button'>Back</button>
						<button className='secondary-btn' onClick={handleEdit} data-testid='edit-button'>Edit</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default Member;
