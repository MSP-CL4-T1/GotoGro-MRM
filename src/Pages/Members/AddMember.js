import React, {useState, useEffect} from 'react';
import TextInputWithValidation from '../../Components/TextInputWithValidation';
import {addMember} from '../../Supabase/supabaseService';
import {useNavigate} from 'react-router-dom';
import {validateInput} from '../../utils';

function AddMember() {
	// State variables to store member information
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [dateJoined, setDateJoined] = useState('');

	const [firstNameError, setFirstNameError] = useState(validateInput(firstName, true, /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/, 'Invalid Character'));
	const [lastNameError, setLastNameError] = useState(validateInput(lastName, true, /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/, 'Invalid Character'));
	const [emailError, setEmailError] = useState(validateInput(email, true, /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, 'Invalid Email'));

	const navigate = useNavigate();

	const handleSave = async e => {
		e.preventDefault();

		if (firstNameError || lastNameError || emailError) {
			return;
		}

		const currentDate = new Date();

		try {
			const newMember = {
				first_name: firstName,
				last_name: lastName,
				email,
				date_joined: dateJoined ? dateJoined : currentDate,
			};

			const newId = await addMember(newMember);
			localStorage.setItem('selectedMember', JSON.stringify({member_id: newId, ...newMember}));
			navigate('/member');
		} catch (error) {
			console.error(error);
		}
	};

	const handleCancel = () => {
		navigate('/members-home');
	};

	// Use useEffect to calculate validation errors as the inputs change
	useEffect(() => {
		setFirstNameError(
			validateInput(firstName, true, /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/, 'Invalid Character'),
		);
	}, [firstName]);

	useEffect(() => {
		setLastNameError(
			validateInput(lastName, true, /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/, 'Invalid Character'),
		);
	}, [lastName]);

	useEffect(() => {
		setEmailError(
			validateInput(email, true, /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, 'Invalid Email'),
		);
	}, [email]);

	return (
		<div className='card'>
			<h2>Add Member</h2>
			<form onSubmit={handleSave} className='form-container'>
				<TextInputWithValidation
					label='First Name:'
					value={firstName}
					onChange={setFirstName}
					required={true}
					error={firstNameError}
					testid='first-name-input'
				/>
				<TextInputWithValidation
					label='Last Name:'
					value={lastName}
					onChange={setLastName}
					required={true}
					error={lastNameError}
					testid='last-name-input'
				/>
				<TextInputWithValidation
					label='Email:'
					value={email}
					onChange={setEmail}
					required={true}
					error={emailError}
					testid='email-input'
				/>
				<TextInputWithValidation
					type='date'
					label='Date Joined:'
					value={dateJoined}
					onChange={setDateJoined}
					testid='date-joined-input'
				/>
				<div className='btn-container'>
					<button className='primary-btn' type='submit' data-testid='add-button'>Add Member</button>
					<button className='tertiary-btn' type='cancel' data-testid='cancel-button' onClick={handleCancel}>Cancel</button>
				</div>
			</form>
		</div>
	);
}

export default AddMember;
