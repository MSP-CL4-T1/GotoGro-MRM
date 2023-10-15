import React, {useEffect, useState} from 'react';
import TextInputWithValidation from '../../Components/TextInputWithValidation';
import {addSaleRecord, fetchProducts, fetchMembers} from '../../Supabase/supabaseService';
import {useNavigate} from 'react-router-dom';
import {validateInput} from '../../utils';

function AddSaleRecords() {
	// State variables to store sale record information
	const [memberId, setMemberId] = useState('');
	const [productId, setProductId] = useState('');
	const [saleDate, setSaleDate] = useState('');
	const [quantity, setQuantity] = useState('');
	const [totalAmount, setTotalAmount] = useState('');
	const [members, setMembers] = useState([]);
	const [products, setProducts] = useState([]);

	const [memberIdError, setMemberIdError] = useState(validateInput(memberId, true));
	const [productIdError, setProductIdError] = useState(validateInput(productId, true));
	const [saleDateError, setSaleDateError] = useState(validateInput(saleDate, true));
	const [quantityError, setQuantityError] = useState(validateInput(quantity, true));
	const [totalAmountError, setTotalAmountError] = useState(validateInput(totalAmount, true));

	const navigate = useNavigate();

	const handleSave = async e => {
		e.preventDefault();

		if (memberIdError || productIdError || saleDateError || quantityError || totalAmountError) {
			return;
		}

		try {
			const newSaleRecord = {
				sale_date: saleDate,
				member_id: memberId,
				quantity,
				product_id: productId,
				total_amount: totalAmount,
			};

			const newSaleId = await addSaleRecord(newSaleRecord);
			localStorage.setItem('selectedSaleRecord', JSON.stringify({sale_id: newSaleId, ...newSaleRecord}));
			navigate('/sale-records');
		} catch (error) {
			console.error(error);
		}
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

	const handleCancel = () => {
		navigate('/sale-records-home');
	};

	// Use useEffect to calculate validation errors as the inputs change
	useEffect(() => {
		setMemberIdError(
			validateInput(memberId, true),
		);
	}, [memberId]);

	useEffect(() => {
		setProductIdError(
			validateInput(productId, true),
		);
	}, [productId]);

	useEffect(() => {
		setSaleDateError(
			validateInput(saleDate, true),
		);
	}, [saleDate]);

	useEffect(() => {
		setQuantityError(
			validateInput(quantity, true),
		);
	}, [quantity]);

	useEffect(() => {
		setTotalAmountError(
			validateInput(totalAmount, true),
		);
	}, [totalAmount]);

	return (
		<div className='card'>
			<h2>Add Sale Record</h2>
			<form onSubmit={handleSave} className='form-container'>
				<div className='label-input'>
					<strong>Member ID:</strong><span className='required-star'> *</span>
					<div className={`input-with-validation ${memberIdError ? 'has-error' : ''}`}>
						<select
							value={memberId}
							onChange={e => setMemberId(e.target.value)}
							title='Select a Member'
						>
							<option value=''>Select a Member</option>
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
					<strong>Product Name:</strong><span className='required-star'> *</span>
					<div className={`input-with-validation ${productIdError ? 'has-error' : ''}`}>
						<select value={productId} onChange={e => setProductId(e.target.value)} data-testid='product-name-dropdown'>
							<option value=''>Select a Product</option>
							{products && products.map(product => (
								<option key={product.product_id} value={product.product_id}>
									{product.product_name}
								</option>
							))}
						</select>
						{(productIdError) && <span className='error-message'>{productIdError}</span>}
					</div>
				</div>
				<TextInputWithValidation
					label='Sale Date:'
					value={saleDate}
					onChange={setSaleDate}
					required={true}
					error={saleDateError}
					type='date'
					testid='sale-date-input'
				/>
				<TextInputWithValidation
					label='Quantity:'
					value={quantity}
					onChange={setQuantity}
					required={true}
					error={quantityError}
					type='number'
					testid='quantity-input'
				/>
				<TextInputWithValidation
					label='Total Amount:'
					value={totalAmount}
					onChange={setTotalAmount}
					required={true}
					error={totalAmountError}
					type='number'
					testid='total-amount-input'
				/>
				<div className='btn-container'>
					<button className='secondary-btn' type='submit' data-testid='add-button'>Add Sale Record</button>
					<button className='tertiary-btn' type='cancel' data-testid='cancel-button' onClick={handleCancel}>Cancel</button>
				</div>
			</form>
		</div>
	);
}

export default AddSaleRecords;
