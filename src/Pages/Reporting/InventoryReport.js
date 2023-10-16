import React, {useMemo, useState} from 'react';
import Papa from 'papaparse';
import {fetchProducts, updateProducts} from '../../Supabase/supabaseService';
import './InventoryReport.css';
import Fuse from 'fuse.js';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextInputWithValidation from '../../Components/TextInputWithValidation';

function InventoryReport() {
	const [products, setProducts] = useState([]);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [editedProducts, setEditedProducts] = useState([]);
	const [selectedDescription, setSelectedDescription] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [sortDirection, setSortDirection] = useState('asc');
	const [filters, setFilters] = useState({
		'Product Id': {type: 'equal', value: ''},
		price: {type: 'range', value: ''},
		stock_quantity: {type: 'range', value: ''},
	});
	const [uiState, setUiState] = useState({
		isLoading: false,
		showNoProductsFound: false,
		showModal: false,
		showFilterMenu: false,
	});
	const [columnVisibility, setColumnVisibility] = useState({
		productId: true,
		product_name: true,
		description: true,
		price: true,
		stock_quantity: true,
	});

	const handleEditSubmit = async e => {
		e.preventDefault();

		const updatedProductsList = products.map(p =>
			p.product_id === selectedProduct.product_id ? selectedProduct : p,
		);
		setProducts(updatedProductsList);

		setEditedProducts(prev => [...prev, selectedProduct]);

		setUiState(prev => ({...prev, showModal: false}));
		toast.success('Product updated successfully!');
	};

	const handleRowClick = product => {
		setSelectedProduct(product);
		setSelectedDescription(product.description); // You may not need this anymore.
		setUiState(prev => ({...prev, showModal: true}));
	};

	const handleBulkSave = async () => {
		try {
			await updateProducts(editedProducts);
			setEditedProducts([]); // Reset edited products
			toast.success('All edited products updated successfully!');
		} catch (e) {
			toast.error('Failed to bulk update products.');
			console.error(e);
		}
	};

	const fetchInventory = async () => {
		try {
			setUiState(prev => ({...prev, isLoading: true}));
			const fetchedProducts = await fetchProducts();
			setProducts(fetchedProducts);

			if (fetchedProducts.length === 0) {
				setUiState(prev => ({...prev, showNoProductsFound: true}));
			}
		} catch (error) {
			console.error(error);
		} finally {
			setUiState(prev => ({...prev, isLoading: false}));
		}
	};

	const handleExportToCSV = () => {
		const filteredInventory = filterInventory(sortProducts(products)).map(product => {
			const obj = {};
			if (columnVisibility.productId) {
				obj.product_id = product.product_id;
			}

			if (columnVisibility.product_name) {
				obj.product_name = product.product_name;
			}

			if (columnVisibility.description) {
				obj.description = product.description;
			}

			if (columnVisibility.price) {
				obj.price = product.price;
			}

			if (columnVisibility.stock_quantity) {
				obj.stock_quantity = product.stock_quantity;
			}

			return obj;
		});
		const csv = Papa.unparse(filteredInventory);
		const blob = new Blob([csv], {type: 'text/csv'});
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.setAttribute('hidden', '');
		a.setAttribute('href', url);
		a.setAttribute('download', 'products_export.csv');
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

	const sortProducts = products => [...products].sort((a, b) => {
		if (sortDirection === 'asc') {
			return a.product_id - b.product_id;
		}

		return b.product_id - a.product_id;
	});

	const resetFilters = () => {
		setFilters({
			product_id: {type: 'equal', value: ''},
			price: {type: 'range', value: ''},
			stock_quantity: {type: 'range', value: ''},
		});
	};

	const filterInventory = products => products.filter(product => Object.keys(filters).every(field => {
		const filter = filters[field];

		if (!filter.value || filter.value.trim() === '') {
			return true;
		}

		const productValue = Number(product[field]);
		const filterValue = Number(filter.value.trim());

		switch (filter.type) {
			case 'equal':
				return productValue === filterValue;
			case 'different':
				return productValue !== filterValue;
			case 'greater':
				return productValue > filterValue;
			case 'smaller':
				return productValue < filterValue;
			case 'range': {
				const [startStr, endStr] = filter.value.split('-').map(val => Number(val.trim()));
				if (startStr && endStr) {
					return productValue >= startStr && productValue <= endStr;
				}

				if (startStr) {
					return productValue >= startStr;
				}

				if (endStr) {
					return productValue <= endStr;
				}

				return true;
			}

			default:
				return true;
		}
	}));

	const toggleSortDirection = () => {
		setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
	};

	const toggleColumnVisibility = columnKey => {
		setColumnVisibility(prevState => ({...prevState, [columnKey]: !prevState[columnKey]}));
	};

	const fuse = useMemo(() => new Fuse(products, {
		keys: ['product_id', 'product_name', 'description', 'price', 'stock_quantity'],
		threshold: 0.3,
		includeScore: true,
		location: 0,
		distance: 100,
		maxPatternLength: 32,
		minMatchCharLength: 1,
		shouldSort: true,
	}), [products]);

	const searchProducts = products => searchTerm ? fuse.search(searchTerm).map(result => result.item) : products;

	const displayedProducts = useMemo(() => {
		let filteredProducts = products;
		filteredProducts = searchProducts(filteredProducts); // First, apply search
		filteredProducts = filterInventory(filteredProducts); // Then, apply filters
		return sortProducts(filteredProducts); // Finally, sort the products
	}, [products, searchTerm, filters, sortDirection]);

	return (
		<div className='card'>
			<ToastContainer />
			<h2>Inventory Report</h2>
			<div className='btn-container'>
				<button className='primary-btn' type='button' onClick={fetchInventory}>Load Inventory</button>
				<button className='secondary-btn' type='button' onClick={handleExportToCSV}>Export</button>
			</div>

			{uiState.isLoading ? <p>Loading...</p> : null}

			{displayedProducts.length > 0 ? (
				<>
					<ProductsTable
						displayedProducts={displayedProducts}
						handleRowClick={handleRowClick}
						sortDirection={sortDirection}
						columnVisibility={columnVisibility}
						setShowFilterMenu={value => setUiState(prev => ({...prev, showFilterMenu: value}))}
						resetFilters={resetFilters}
						toggleSortDirection={toggleSortDirection}
						toggleColumnVisibility={toggleColumnVisibility}
						uiState={uiState}
						searchTerm={searchTerm}
						setSearchTerm={setSearchTerm}
					/>
					<button onClick={handleBulkSave} className='bulk-save secondary-btn'>Bulk Save</button>
				</>
			) : uiState.showNoProductsFound ? (
				<p>No Products Found</p>
			) : null}

			{uiState.showModal ? (
				<EditModal
					selectedProduct={selectedProduct}
					handleEditSubmit={handleEditSubmit}
					closeModal={() => setUiState(prev => ({...prev, showModal: false}))}
					updateSelectedProduct={value => setSelectedProduct(value)}
					selectedDescription={selectedDescription}
				/>
			) : null}

			{uiState.showFilterMenu ? (
				<FilterMenu filters={filters} setFilters={setFilters}/>
			) : null}
		</div>
	);
}

function ProductsTable({
	displayedProducts,
	columnVisibility,
	handleRowClick,
	sortDirection,
	setShowFilterMenu,
	resetFilters,
	toggleSortDirection,
	toggleColumnVisibility,
	uiState,
	searchTerm,
	setSearchTerm,
}) {
	return (
		<div>
			<div className='action-btn'>
				<button onClick={() => setShowFilterMenu(prev => !prev)}>
					Toggle Filter Menu
				</button>
				<button className='tertiary-btn' onClick={resetFilters}>
					Reset Filters
				</button>
			</div>
			{uiState.showFilterMenu ? (
				<div className='search-bar-container'>
					<input
						type='text'
						placeholder='Search...'
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
					/>
				</div>
			) : null}
			<table>
				<thead>
					<tr>
						<th onClick={() => toggleSortDirection()}
							className={columnVisibility.productId ? '' : 'inactive-header'}>
                        Product ID
							{sortDirection === 'asc' ? ' 🔼' : ' 🔽'}
						</th>
						<th onClick={() => toggleColumnVisibility('productName')}
							className={columnVisibility.productName ? '' : 'inactive-header'}>
                        Product Name
						</th>
						<th onClick={() => toggleColumnVisibility('description')}
							className={columnVisibility.description ? '' : 'inactive-header'}>
                        Description
						</th>
						<th onClick={() => toggleColumnVisibility('price')}
							className={columnVisibility.price ? '' : 'inactive-header'}>
                        Price
						</th>
						<th onClick={() => toggleColumnVisibility('stockQuantity')}
							className={columnVisibility.stockQuantity ? '' : 'inactive-header'}>
                        Stock Quantity
						</th>
					</tr>
				</thead>
				<tbody>
					{displayedProducts.map(product => (
						<tr key={product.product_id}>
							<td onClick={() => handleRowClick(product)}>
								{columnVisibility.productId ? product.product_id : null}
							</td>
							<td onClick={() => handleRowClick(product)}>
								{columnVisibility.productName ? product.product_name : null}
							</td>
							<td onClick={() => handleRowClick(product)}>
								{columnVisibility.description ? product.description : null}
							</td>
							<td onClick={() => handleRowClick(product)}>
								{columnVisibility.price ? ('$' + product.price) : null}
							</td>
							<td onClick={() => handleRowClick(product)}>
								{columnVisibility.stockQuantity ? product.stock_quantity : null}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

function EditModal({
	selectedProduct,
	closeModal,
	handleEditSubmit,
	updateSelectedProduct,
}) {
	const handleValueChange = (attribute, value) => {
		const updatedProduct = {...selectedProduct, [attribute]: value};
		updateSelectedProduct(updatedProduct);
	};

	// Helper function to format attribute for display
	const formatAttribute = attribute =>
		attribute
			.split('_') // Split the string on underscore
			.map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
			.join(' ');

	return (
		<div className='edit-modal'>
			<h3 className='edit-modal__title'>Edit Product</h3>
			<form className='edit-modal__form' onSubmit={handleEditSubmit}>
				{Object.keys(selectedProduct).map(attribute => (
					<TextInputWithValidation
						key={attribute}
						label={formatAttribute(attribute)}
						value={selectedProduct[attribute]}
						onChange={handleValueChange}
					/>
				))}
				<div className='edit-modal__actions'>
					<button className='edit-modal__save-btn secondary-btn' type='submit'>Save</button>
					<button className='edit-modal__cancel-btn tertiary-btn' type='button' onClick={closeModal}>Cancel</button>
				</div>
			</form>
		</div>
	);
}

function FilterMenu({filters, setFilters}) {
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
			<h3>Filter Options</h3>
			<form className={'filter-form'} onSubmit={e => e.preventDefault()}>
				{Object.keys(filters).map(field => {
					const isRange = filters[field].type === 'range';
					return (
						<div key={field} className='filter-container'>
							<fieldset className='filter-fieldset'>
								<legend>Filter by {field}:</legend>
								<select
									className='filter-select'
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
									className='filter-input'
									type='text'
									placeholder={isRange ? 'Start' : 'Value'}
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
										className='filter-input'
										type='text'
										placeholder='End'
										onChange={e => {
											if (isRange) {
												updateFilter(field, e.target.value, 'end');
											} else {
												updateFilter(field, e.target.value);
											}
										}}
									/>
								)}
							</fieldset>
						</div>
					);
				})}
			</form>
			<div className='apply-button-container'>
			</div>
		</div>
	);
}

export default InventoryReport;
