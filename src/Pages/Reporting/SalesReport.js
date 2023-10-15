import React, {useState, useEffect} from 'react';
import Papa from 'papaparse';
import {fetchSalesByDateRange, fetchTop100Sales} from '../../Supabase/supabaseService';
import './SalesReport.css';
import TextInputWithValidation from '../../Components/TextInputWithValidation';
import {validateInput} from '../../utils';

function SalesReport() {
	const [sales, setSales] = useState([]);
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [selectedSale, setSelectedSale] = useState(null);
	const [sortDirection, setSortDirection] = useState('asc');
	const [filters, setFilters] = useState({
		sale_id: {type: 'equal', value: ''},
		member_id: {type: 'equal', value: ''},
		product_id: {type: 'equal', value: ''},
		sale_date: {type: 'equal', value: ''},
		quantity: {type: 'equal', value: ''},
		total_amount: {type: 'equal', value: ''},
	});
	const [uiState, setUiState] = useState({
		isLoading: false,
		showNoSalesFound: false,
		showModal: false,
		showFilterMenu: false,
	});
	const [columnVisibility, setColumnVisibility] = useState({
		saleId: true,
		memberId: true,
		productId: true,
		saleDate: true,
		quantity: true,
		totalAmount: true,
	});

	const [month, setMonth] = useState('');
	const [year, setYear] = useState('');

	const [yearError, setYearError] = useState(validateInput(year, false, /^(.|\n){0,4}$/, 'Invalid Year - Should be a Max of 4 Digits'));

	useEffect(() => {
		setYearError(
			validateInput(year, false, /^(.|\n){0,4}$/, 'Invalid Year - Should be a Max of 4 Digits'),
		);
	}, [year]);

	const toggleFilterMenu = () => {
		setUiState(prev => ({...prev, showFilterMenu: !prev.showFilterMenu}));
	};

	const fetchSalesForMonth = async (month, year) => {
		let searchResults;
		try {
			if (!month) {
				// Handle the case when 'month' is '00' (all records)
				searchResults = await fetchTop100Sales();
			} else if (month) {
				year = new Date().getFullYear().toString();
				setStartDate(`${year}-${month}-01`);
				const lastDay = new Date(year, parseInt(month, 10), 0).getDate(); // Get the last day of the selected month
				setEndDate(`${year}-${month}-${lastDay}`);
				searchResults = await fetchSalesByDateRange(startDate, endDate);
			}

			setSales(searchResults);

			if (searchResults.length === 0) {
				setUiState(prev => ({...prev, showNoSalesFound: true}));
			}
		} catch (error) {
			console.error('Error fetching sales: ', error);
		}
	};

	const handleEditSubmit = async e => {
		e.preventDefault();

		// Send the updated `selectedSale` to your backend to save the changes
		// For now, just updating the state to reflect the changes
		const updatedSales = sales.map(s => s.sale_id === selectedSale.sale_id ? selectedSale : s);
		setSales(updatedSales);

		// Fixing the 'setShowModal' is not defined issue
		setUiState(prev => ({...prev, showModal: false}));
	};

	const handleRowClick = (key, value) => {
		setSelectedSale({key, value});
		setUiState(prev => ({...prev, showModal: true}));
	};

	const toggleColumnVisibility = columnKey => {
		setColumnVisibility(prevState => ({...prevState, [columnKey]: !prevState[columnKey]}));
	};

	const handleExportToCSV = () => {
		// Filter the visible columns based on columnVisibility
		const filteredSales = filterSales(sortSales(sales)).map(sale => {
			const obj = {};
			if (columnVisibility.saleId) {
				obj.sale_id = sale.sale_id;
			}

			if (columnVisibility.memberId) {
				obj.member_id = sale.member_id;
			}

			if (columnVisibility.productId) {
				obj.product_id = sale.product_id;
			}

			if (columnVisibility.saleDate) {
				obj.sale_date = sale.sale_date;
			}

			if (columnVisibility.quantity) {
				obj.quantity = sale.quantity;
			}

			if (columnVisibility.totalAmount) {
				obj.total_amount = sale.total_amount;
			}

			return obj;
		});

		// Convert the data to CSV format
		const csv = Papa.unparse(filteredSales);

		// Create a blob and download it
		const blob = new Blob([csv], {type: 'text/csv'});
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.setAttribute('hidden', '');
		a.setAttribute('href', url);
		a.setAttribute('download', 'sales_export.csv');
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

	const sortSales = sales => [...sales].sort((a, b) => {
		if (sortDirection === 'asc') {
			return a.sale_id - b.sale_id;
		}

		return b.sale_id - a.sale_id;
	});

	const resetFilters = () => {
		setFilters({
			sale_id: {type: 'equal', value: ''},
			member_id: {type: 'equal', value: ''},
			product_id: {type: 'equal', value: ''},
			sale_date: {type: 'equal', value: ''},
			quantity: {type: 'equal', value: ''},
			total_amount: {type: 'equal', value: ''},
		});
	};

	const clearAll = () => {
		// Reset all states to their initial values
		setSales([]);
		setStartDate('');
		setEndDate('');
		setSelectedSale(null);
		setMonth('');
		setYear('');
		resetFilters();
	};

	const isEqual = (a, b) => a === b;
	const isDifferent = (a, b) => a !== b;
	const isGreater = (a, b) => a > b;
	const isSmaller = (a, b) => a < b;

	const isInRange = (value, range) => {
		const [startStr, endStr] = range.split('-').map(val => val.trim());

		const start = startStr ? (typeof value === 'number' ? Number(startStr) : startStr) : null;
		const end = endStr ? (typeof value === 'number' ? Number(endStr) : endStr) : null;

		if (start && end) {
			return value >= start && value <= end;
		}

		if (start) {
			return value >= start;
		}

		if (end) {
			return value <= end;
		}

		return false; // Invalid filter format
	};

	const filterSales = sales => sales.filter(sale =>
		Object.keys(filters).every(field => {
			const filter = filters[field];
			if (!filter.value || filter.value.trim() === '') {
				return true;
			}

			let saleValue = sale[field];
			let filterValue = filter.value;

			if (typeof saleValue === 'number' && !isNaN(Number(filterValue))) {
				filterValue = Number(filterValue);
			}

			if (typeof saleValue === 'string' && typeof filterValue === 'string') {
				saleValue = saleValue.toLowerCase().trim();
				filterValue = filterValue.toLowerCase().trim();
			}

			switch (filter.type) {
				case 'equal': return isEqual(saleValue, filterValue);
				case 'different': return isDifferent(saleValue, filterValue);
				case 'greater': return isGreater(saleValue, filterValue);
				case 'smaller': return isSmaller(saleValue, filterValue);
				case 'range': return isInRange(saleValue, filterValue);
				default: return true;
			}
		}),
	);

	const toggleSortDirection = () => {
		setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
	};

	// Adjust the rendered sales
	const displayedSales = filterSales(sortSales(sales));

	return (
		<div className='card'>
			<h2>Sales Report</h2>
			<form onSubmit={e => {
				e.preventDefault();
				fetchSalesForMonth(month, year);
			}}>
				<div className='form-container'>
					<div className='label-input'>
						<strong>Month:</strong>
						<div className='input-with-validation'>
							<select value={month} onChange={e => setMonth(e.target.value)}>
								<option value='00'>Select...</option>
								<option value='01'>January</option>
								<option value='02'>February</option>
								<option value='03'>March</option>
								<option value='04'>April</option>
								<option value='05'>May</option>
								<option value='06'>June</option>
								<option value='07'>July</option>
								<option value='08'>August</option>
								<option value='09'>September</option>
								<option value='10'>October</option>
								<option value='11'>November</option>
								<option value='12'>December</option>
							</select>
						</div>
					</div>
					<TextInputWithValidation
						label='Year:'
						value={year}
						onChange={setYear}
						error={yearError}
						testid='first-name-input'
						type='number'
					/>
				</div>
				<div className='btn-container'>
					<button type='submit' className='primary-btn'>Submit</button>
					<button type='reset' className='tertiary-btn' onClick={clearAll}>Clear</button>
					<button className='secondary-btn' onClick={handleExportToCSV}>Export</button>
				</div>
			</form>

			{uiState.isLoading ? <p>Loading...</p> : null}

			{displayedSales.length > 0 ? (
				<SalesTable
					displayedSales={displayedSales}
					columnVisibility={columnVisibility}
					handleRowClick={handleRowClick}
					sortDirection={sortDirection}
					setShowFilterMenu={toggleFilterMenu}
					resetFilters={resetFilters}
					toggleSortDirection={toggleSortDirection}
					toggleColumnVisibility={toggleColumnVisibility}
					uiState={uiState}
					filters={filters}
					setFilters={setFilters}
				/>
			) : uiState.showNoSalesFound ? (
				<p>No Sales Found</p>
			) : null}

			{uiState.showModal ? (
				<EditModal
					selectedSale={selectedSale}
					setShowModal={value => setUiState(prev => ({...prev, showModal: value}))}
					handleEditSubmit={handleEditSubmit}
					setSelectedSale={setSelectedSale}
				/>
			) : null}
		</div>
	);
}

function SalesTable({
	displayedSales,
	columnVisibility,
	handleRowClick,
	sortDirection,
	setShowFilterMenu,
	resetFilters,
	toggleSortDirection,
	toggleColumnVisibility,
	uiState,
	filters,
	setFilters,
}) {
	return (
		<div>
			<div className='btn-container'>
				<button className='primary-btn' onClick={() => setShowFilterMenu(prev => !prev)}>
										Toggle Filter Menu
				</button>
				<button className='tertiary-btn' onClick={resetFilters}>
										Reset Filters
				</button>
			</div>
			{uiState.showFilterMenu ? (
				<FilterMenu filters={filters} setFilters={setFilters} />
			) : null}
			<table>
				<thead>
					<tr>
						<th
							onClick={() => {
								toggleSortDirection(); // Toggle sort direction when Sale ID header is clicked
							}}
							className={columnVisibility.saleId ? '' : 'inactive-header'}>
														Sale ID
							{sortDirection === 'asc' ? ' 🔼' : ' 🔽'}
						</th>
						<th onClick={() => toggleColumnVisibility('memberId')}
							className={columnVisibility.memberId ? '' : 'inactive-header'}>
														Member ID
						</th>
						<th onClick={() => toggleColumnVisibility('productId')}
							className={columnVisibility.productId ? '' : 'inactive-header'}>
														Product ID
						</th>
						<th onClick={() => toggleColumnVisibility('saleDate')}
							className={columnVisibility.saleDate ? '' : 'inactive-header'}>
														Sale Date
						</th>
						<th onClick={() => toggleColumnVisibility('quantity')}
							className={columnVisibility.quantity ? '' : 'inactive-header'}>
														Quantity
						</th>
						<th onClick={() => toggleColumnVisibility('totalAmount')}
							className={columnVisibility.totalAmount ? '' : 'inactive-header'}>
														Total Amount
						</th>
					</tr>
				</thead>
				<tbody>
					{/* Assuming 'displayedSales' is defined correctly above */}
					{displayedSales.map(sale => (
						<tr key={sale.sale_id}>
							<td onClick={() => handleRowClick('sale_id', sale.sale_id)}>
								{columnVisibility.saleId ? sale.sale_id : null}
							</td>
							<td onClick={() => handleRowClick('member_id', sale.member_id)}>
								{columnVisibility.memberId ? sale.member_id : null}
							</td>
							<td onClick={() => handleRowClick('product_id', sale.product_id)}>
								{columnVisibility.productId ? sale.product_id : null}
							</td>
							<td onClick={() => handleRowClick('sale_date', sale.sale_date)}>
								{columnVisibility.saleDate ? sale.sale_date : null}
							</td>
							<td onClick={() => handleRowClick('quantity', sale.quantity)}>
								{columnVisibility.quantity ? sale.quantity : null}
							</td>
							<td onClick={() => handleRowClick('total_amount', sale.total_amount)}>
								{columnVisibility.totalAmount ? sale.total_amount : null}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

function EditModal({
	selectedSale,
	setShowModal,
	handleEditSubmit,
	setSelectedSale,
}) {
	return (
		<div className='modal'>
			<h3>Edit {selectedSale.key}</h3>
			<form onSubmit={handleEditSubmit}>
				<label>
					{selectedSale.key}:
					<input
						type='text'
						value={selectedSale.value}
						onChange={e => setSelectedSale({...selectedSale, value: e.target.value})}
					/>
				</label>
				<div>
					<button className='secondary-btn' type='submit'>Save</button>
					<button className='tertiary-btn' onClick={() => setShowModal(false)}>Cancel</button>
				</div>
			</form>
		</div>
	);
}

function FilterMenu({filters, setFilters, onApplyFilters}) {
	// Helper function to update filter value
	const updateFilter = (field, value, rangePart) => {
		const newFilters = {...filters};
		const [startValue, endValue] = newFilters[field].value.split('-');

		if (startValue === null && endValue === null) {
			newFilters[field].value = '';
		} else if (rangePart === 'start') {
			newFilters[field].value = value + '-';
		} else if (rangePart === 'end') {
			newFilters[field].value = '0-' + value;
		} else {
			newFilters[field].value = value;
		}

		setFilters(newFilters);
	};

	return (
		<div className='filter-menu'>
			<h3>Filter Menu</h3>
			<form onSubmit={e => e.preventDefault()}>
				{Object.keys(filters).map(field => {
					const isRange = filters[field].type === 'range';
					return (
						<div key={field}>
							<label>
																Filter by {field}:
								<select
									value={filters[field].type}
									onChange={e => {
										const newFilters = {...filters};
										newFilters[field].type = e.target.value;
										setFilters(newFilters);
									}}
								>
									<option value='equal'>Equal to</option>
									<option value='different'>Different from</option>
									<option value='greater'>Greater than</option>
									<option value='smaller'>Smaller than</option>
									<option value='range'>Range</option>
								</select>
								<input
									type='text'
									// Value={filters[field].value.split('-')[0] || ''}
									placeholder={isRange ? 'Start value' : ''}
									onChange={e => {
										if (isRange) {
											updateFilter(field, e.target.value, 'start');
										} else {
											updateFilter(field, e.target.value);
										}
									}}
								/>
								{isRange && (
									<input
										type='text'
										placeholder='End value'
										// Value={filters[field].value.split('-')[1] || ''}
										onChange={e => {
											if (isRange) {
												updateFilter(field, e.target.value, 'end');
											} else {
												updateFilter(field, e.target.value);
											}
										}}
									/>
								)}
							</label>
						</div>
					);
				})}
				<button className='secondary-btn' onClick={onApplyFilters}>
										Apply Filters
				</button>
			</form>
		</div>
	);
}

export default SalesReport;
