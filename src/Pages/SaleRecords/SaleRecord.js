import React, {useEffect, useState} from 'react';
import {
	fetchMembers,
	fetchProducts,
	updateSaleRecord,
} from '../../Supabase/supabaseService';
import {useNavigate} from 'react-router-dom';
import TextInputWithValidation from '../../Components/TextInputWithValidation';
import {validateInput} from '../../utils';
import './SaleRecord.css';

function SaleRecord() {
	const [saleRecord, setSaleRecord] = useState(JSON.parse(localStorage.getItem('selectedSaleRecord')));
	const [isEditing, setIsEditing] = useState(JSON.parse(localStorage.getItem('editingSaleRecord')));
	const [editedMemberID, setEditedMemberID] = useState(saleRecord.member_id);
	const [editedProductID, setEditedProductID] = useState(saleRecord.product_id);
	const [editedSaleDate, setEditedSaleDate] = useState(saleRecord.sale_date);
	const [editedQuantity, setEditedQuantity] = useState(saleRecord.quantity);
	const [editedTotalAmount, setEditedTotalAmount] = useState(saleRecord.total_amount);
	const [members, setMembers] = useState([]);
	const [products, setProducts] = useState([]);
	const [productPrice, setProductPrice] = useState(0);

	const [memberIdError, setMemberIdError] = useState(validateInput(editedMemberID, true));
	const [productIdError, setProductIdError] = useState(validateInput(editedProductID, true));
	const [saleDateError, setSaleDateError] = useState(validateInput(editedSaleDate, true));
	const [quantityError, setQuantityError] = useState(validateInput(editedQuantity, true));

	const navigate = useNavigate();

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleCancel = () => {
		setIsEditing(false);
		setEditedMemberID(saleRecord.member_id);
		setEditedProductID(saleRecord.product_id);
		setEditedSaleDate(saleRecord.sale_date);
		setEditedQuantity(saleRecord.quantity);
		setEditedTotalAmount(saleRecord.total_amount);
	};

	useEffect(() => {
		const getMembersAndProducts = async () => {
			try {
				const fetchedMembers = await fetchMembers();
				const fetchedProducts = await fetchProducts();
				setMembers(fetchedMembers);
				setProducts(fetchedProducts);
			} catch (error) {
				console.error(error);
			}
		};

		getMembersAndProducts();
	}, []);

	useEffect(() => {
		if (editedProductID) {
			const selectedProductId = parseInt(editedProductID, 10); // Convert productId to a number
			const selectedProduct = products.find(product => product.product_id === selectedProductId);
			if (selectedProduct) {
				setProductPrice(selectedProduct.price);
			} else {
				setProductPrice(0); // Reset price if the product is not found
			}
		} else {
			setProductPrice(0); // Reset price when no product is selected
		}
	}, [editedProductID, products]);

	const handleSave = async e => {
		e.preventDefault();

		if (memberIdError || productIdError || saleDateError || quantityError) {
			return;
		}

		if (quantityError || editedQuantity <= 0) {
			setQuantityError('Quantity must be a positive number');
			return;
		}

		try {
			const updatedSaleRecord = {
				sale_id: saleRecord.sale_id,
				member_id: editedMemberID,
				product_id: editedProductID,
				sale_date: editedSaleDate,
				quantity: editedQuantity,
				total_amount: editedTotalAmount,
			};

			await updateSaleRecord(updatedSaleRecord);
			setSaleRecord(updatedSaleRecord);
			setIsEditing(false);
		} catch (error) {
			console.error(error);
		}
	};

	// Use useEffect to calculate validation errors as the inputs change
	useEffect(() => {
		setMemberIdError(
			validateInput(editedMemberID, true),
		);
	}, [editedMemberID]);

	useEffect(() => {
		setProductIdError(
			validateInput(editedProductID, true),
		);
	}, [editedProductID]);

	useEffect(() => {
		setSaleDateError(
			validateInput(editedSaleDate, true),
		);
	}, [editedSaleDate]);

	useEffect(() => {
		setQuantityError(
			validateInput(editedQuantity, true),
		);
	}, [editedQuantity]);

	useEffect(() => {
		const newTotalAmount = editedQuantity * productPrice;
		setEditedTotalAmount(newTotalAmount);

		if (editedQuantity <= 0) {
			setQuantityError('Quantity must be a positive number');
		} else {
			setQuantityError(validateInput(editedQuantity, true));
		}
	}, [editedQuantity, productPrice]);

	return (
		<div className='card'>
			<h2>Sale Record Details</h2>
			{isEditing ? (
				<div>
					<div className='form-container'>
						<div className='label-input'>
							<strong>Member ID:</strong><span className='required-star'> *</span>
							<div className={`input-with-validation ${memberIdError ? 'has-error' : ''}`}>
								<select
									value={editedMemberID}
									onChange={e => setEditedMemberID(e.target.value)}
									title='Select a Member'
								>
									{members.map(member => (
										<option key={member.member_id} value={member.member_id} className={'member-input'}>
											{member.first_name} {member.last_name} ({member.member_id})
										</option>
									))}
								</select>
								{(memberIdError) && <span className='error-message'>{memberIdError}</span>}
							</div>
						</div>
						<div className='label-input'>
							<strong>Product ID:</strong><span className='required-star'> *</span>
							<div className={`input-with-validation ${productIdError ? 'has-error' : ''}`}>
								<select
									value={editedProductID}
									onChange={e => setEditedProductID(e.target.value)}
								>
									{products.map(product => (
										<option key={product.product_id} value={product.product_id} className={'product-input'}>
											{product.product_name} ({product.product_id})
										</option>
									))}
								</select>
								{(productIdError) && <span className='error-message'>{productIdError}</span>}
							</div>
						</div>
						<TextInputWithValidation
							label='Sale Date:'
							value={editedSaleDate}
							onChange={setEditedSaleDate}
							required={true}
							error={saleDateError}
							type='date'
						/>
						<TextInputWithValidation
							label='Quantity:'
							value={editedQuantity}
							onChange={setEditedQuantity}
							required={true}
							error={quantityError}
							type='number'
						/>
						<TextInputWithValidation
							label='Total Amount:'
							value={'$' + editedTotalAmount}
							readonly={true}
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
							label='Member ID:'
							value={saleRecord.member_id}
							readonly={true}
						/>
						<TextInputWithValidation
							label='Product ID:'
							value={saleRecord.product_id}
							readonly={true}
						/>
						<TextInputWithValidation
							label='Sale Date:'
							value={saleRecord.sale_date}
							type='date'
							readonly={true}
						/>
						<TextInputWithValidation
							label='Quantity:'
							value={saleRecord.quantity}
							type='number'
							readonly={true}
						/>
						<TextInputWithValidation
							label='Total Amount:'
							value={'$' + saleRecord.total_amount}
							readonly={true}
						/>
					</div>
					<div className='btn-container'>
						<button className='tertiary-btn' onClick={() => navigate('/sale-records-home')} data-testid='back-button'>Back</button>
						<button className='secondary-btn' onClick={handleEdit} data-testid='edit-button'>Edit</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default SaleRecord;
