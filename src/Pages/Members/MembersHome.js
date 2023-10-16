import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {searchMembersByName, retrieveDeletedMember, softDeleteMember} from '../../Supabase/supabaseService';
import {useNavigate} from 'react-router-dom';
import './MembersHome.css';

/**
 * MembersHome component for displaying and searching members.
 * @returns {JSX.Element} The rendered JSX element.
 */
function MembersHome() {
	const [members, setMembers] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [showNoMembersFound, setShowNoMembersFound] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();

	/**
     * Handles the search for members.
     * @param {Event} e - The event object.
     */
	const handleSearch = async e => {
		e.preventDefault();

		try {
			setIsLoading(true);
			const searchResults = await searchMembersByName(searchTerm);
			setMembers(searchResults);

			// Show "No Members Found" if no results
			setShowNoMembersFound(searchResults?.length === 0);
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
	const saveSelectedMemberToLocalStorage = async member => {
		localStorage.setItem('selectedMember', JSON.stringify(member));
		localStorage.setItem('editingMember', JSON.stringify(true));
		navigate('/member');
	};

	/**
     * Clears the search and member list.
     */
	const handleClear = () => {
		setSearchTerm('');
		setMembers([]);
		setShowNoMembersFound(false); // Hide "No Members Found" on clear
	};

	const handleRetrieve = async member => {
		try {
			await retrieveDeletedMember(member);
			localStorage.setItem('selectedMember', JSON.stringify(member));
			navigate('/member');
		} catch (error) {
			console.error(error);
		}
	};

	const handleDelete = async member => {
		try {
			await softDeleteMember(member);
			await handleClear();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className='card'>
			<h2>Members Home</h2>
			<div>
				<input
					className='search-input'
					type='text'
					placeholder='Search members...'
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
				/>
				<div className='btn-container'>
					<button className='primary-btn' onClick={handleSearch}>Search</button>
					<button className='tertiary-btn' onClick={handleClear}>Clear</button>
					<Link className='link-btn secondary-btn' to='/add-member'>Add New Member</Link>
				</div>
			</div>
			{isLoading ? (
				<p>Loading...</p>
			) : members?.length > 0 ? (
				<table className='search-results-table'>
					<thead>
						<tr>
							<th>First Name</th>
							<th>Last Name</th>
							<th>Email</th>
							<th>Date Joined</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{members.map(member => (
							<tr key={member.member_id}>
								<td>{member.first_name}</td>
								<td>{member.last_name}</td>
								<td>{member.email}</td>
								<td>{member.date_joined}</td>
								<td>
									{member.deleted
										? (<button className='secondary-btn' onClick={() => {
											handleRetrieve(member);
										}}>Retrieve</button>)
										: (<div className='action-btn'>
											<button className='secondary-btn' onClick={() => saveSelectedMemberToLocalStorage(member)}>Edit</button>
											<button className='primary-btn' data-testid='delete-button' onClick={() => handleDelete(member)}>Delete</button>
										</div>)
									}
								</td>
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

export default MembersHome;
