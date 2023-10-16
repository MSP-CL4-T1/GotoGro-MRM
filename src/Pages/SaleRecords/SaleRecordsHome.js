import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {searchSaleRecordsBySaleID, deleteSaleRecord} from '../../Supabase/supabaseService';
import {useNavigate} from 'react-router-dom';

/**
 * SaleRecordsHome component for displaying and searching sale records.
 * @returns {JSX.Element} The rendered JSX element.
 */
function SaleRecordsHome() {
	const [saleRecords, setSaleRecords] = useState([]);
	const [searchSaleID, setSearchSaleID] = useState('');
	const [showNoSaleRecordsFound, setShowNoSaleRecordsFound] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();

	/**
     * Handles the search for sale records.
     * @param {Event} e - The event object.
     */
	const handleSearch = async e => {
		e.preventDefault();

		try {
			setIsLoading(true);
			const searchResults = await searchSaleRecordsBySaleID(searchSaleID);
			setSaleRecords(searchResults);

			// Show "No Sale Records Found" if no results
			setShowNoSaleRecordsFound(searchResults.length === 0);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleNavigation = saleRecord => {
		localStorage.setItem('selectedSaleRecord', JSON.stringify(saleRecord));
		localStorage.setItem('editingSaleRecord', JSON.stringify(true));
		navigate('/sale-records');
	};

	/**
     * Clears the search and sale records list.
     */
	const handleClear = () => {
		setSearchSaleID('');
		setSaleRecords([]);
		setShowNoSaleRecordsFound(false); // Hide "No Sale Records Found" on clear
	};

	const handleDelete = async saleRecord => {
		try {
			await deleteSaleRecord(saleRecord);
			localStorage.removeItem('selectedSaleRecord');
			navigate('/sale-records-home');
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className='card'>
			<h2>Sale Records Home</h2>
			<div>
				<input
					className='search-input'
					type='text'
					placeholder='Search sale records by Sale ID...'
					value={searchSaleID}
					onChange={e => setSearchSaleID(e.target.value)}
				/>
				<div className='btn-container'>
					<button className='primary-btn' onClick={handleSearch}>Search</button>
					<button className='tertiary-btn' onClick={handleClear}>Clear</button>
					<Link className='link-btn secondary-btn' to='/add-sale-record'>Add New Sale Record</Link>
				</div>
			</div>
			{isLoading ? (
				<p>Loading...</p>
			) : saleRecords.length > 0 ? (
				<table className='search-results-table'>
					<thead>
						<tr>
							<th>Sale ID</th>
							<th>Member ID</th>
							<th>Sale Date</th>
							<th>Quantity</th>
							<th>Total Amount</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{saleRecords.map(saleRecord => (
							<tr key={saleRecord.sale_id}>
								<td>{saleRecord.sale_id}</td>
								<td>{saleRecord.member_id}</td>
								<td>{saleRecord.sale_date}</td>
								<td>{saleRecord.quantity}</td>
								<td>{'$' + saleRecord.total_amount}</td>
								<td>
									<div className='action-btn'>
										<button className='secondary-btn' onClick={() => handleNavigation(saleRecord)}>Edit</button>
										<button className='primary-btn' onClick={() => handleDelete(saleRecord)} data-testid='delete-button'>Delete</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : showNoSaleRecordsFound ? (
				<p>No Sale Records Found</p>
			) : null}
		</div>
	);
}

export default SaleRecordsHome;
