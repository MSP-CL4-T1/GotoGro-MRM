import React, {useState, useEffect} from 'react';
import {softDeleteProduct, updateProduct} from '../../Supabase/supabaseService';
import {useNavigate} from 'react-router-dom';
import TextInputWithValidation from '../../Components/TextInputWithValidation';
import ProductCard from './ProductCard';
import {validateInput} from '../../utils';
import './Product.css';

function Product() {
	const initialProductData = JSON.parse(localStorage.getItem('selectedProduct'));
	const [product, setProduct] = useState(initialProductData);
	const [isEditing, setIsEditing] = useState(JSON.parse(localStorage.getItem('editingProduct')));
	const [editedProductName, setEditedProductName] = useState(product.product_name);
	const [editedDescription, setEditedDescription] = useState(product.description);
	const [editedPrice, setEditedPrice] = useState(product.price);
	const [editedStockQuantity, setEditedStockQuantity] = useState(product.stock_quantity);
	const [editedImage, setEditedImage] = useState(product.image);

	const [productNameError, setProductNameError] = useState(validateInput(editedProductName, true));
	const [descriptionError, setDescriptionError] = useState(validateInput(editedDescription, true));
	const [priceError, setPriceError] = useState(validateInput(editedPrice, true));
	const [stockQuantityError, setStockQuantityError] = useState(validateInput(editedStockQuantity, true));
	const [imageError, setImageError] = useState(validateInput(editedImage, true));

	const navigate = useNavigate();

	useEffect(() => {
		setProduct({
			product_id: product.product_id,
			product_name: editedProductName,
			description: editedDescription,
			price: editedPrice,
			stock_quantity: editedStockQuantity,
			image: editedImage,
		});
	}, [product.product_id, editedProductName, editedDescription, editedPrice, editedStockQuantity, editedImage]);

	// Turns the component into editing mode
	const handleEdit = () => {
		setIsEditing(true);
	};

	// Cancels the changes and resets the values to original values
	const handleCancel = () => {
		setIsEditing(false);
		setEditedProductName(initialProductData.product_name);
		setEditedDescription(initialProductData.description);
		setEditedPrice(initialProductData.price);
		setEditedStockQuantity(initialProductData.stock_quantity);
		setEditedImage(initialProductData.image);
	};

	// Saves the changes to the product by calling the updateProduct function from supabaseService
	const handleSave = async e => {
		e.preventDefault();

		if (productNameError || descriptionError || priceError || stockQuantityError || imageError) {
			return;
		}

		try {
			const updatedProduct = {
				product_id: product.product_id,
				product_name: product.product_name,
				description: product.description,
				price: product.price,
				stock_quantity: product.stock_quantity,
				image: product.image,
			};

			await updateProduct(updatedProduct);
			setProduct(updatedProduct);
			setIsEditing(false);
		} catch (error) {
			console.error(error);
		}
	};

	// Soft deletes the product and redirects the user to the ProductsHome screen
	const handleDelete = async () => {
		try {
			await softDeleteProduct(product);
			localStorage.removeItem('selectedProduct');
			navigate('/products-home');
		} catch (error) {
			console.error(error);
		}
	};

	// Use useEffect to calculate validation errors as the inputs change
	useEffect(() => {
		setProductNameError(
			validateInput(editedProductName, true),
		);
	}, [editedProductName]);

	useEffect(() => {
		setDescriptionError(
			validateInput(editedDescription, true),
		);
	}, [editedDescription]);

	useEffect(() => {
		setPriceError(
			validateInput(editedPrice, true),
		);
	}, [editedPrice]);

	useEffect(() => {
		setStockQuantityError(
			validateInput(editedStockQuantity, true),
		);
	}, [editedStockQuantity]);

	useEffect(() => {
		setImageError(
			validateInput(editedImage, true),
		);
	}, [editedImage]);

	return (
		<div className='card'>
			<h2>Product Details</h2>
			{isEditing ? (
				<div>
					<div className='data-preview'>
						<div>
							<TextInputWithValidation
								label='Image URL/Path:'
								value={editedImage}
								onChange={setEditedImage}
								required={true}
								error={imageError}
								testid='image-input'
							/>
							<TextInputWithValidation
								label='Product Name:'
								value={editedProductName}
								onChange={setEditedProductName}
								required={true}
								error={productNameError}
								testid='product-name-input'
							/>
							<TextInputWithValidation
								label='Description:'
								value={editedDescription}
								onChange={setEditedDescription}
								required={true}
								error={descriptionError}
								testid='description-input'
							/>
							<TextInputWithValidation
								label='Price:'
								value={editedPrice}
								onChange={setEditedPrice}
								required={true}
								error={priceError}
								testid='price-input'
								type='number'
							/>
							<TextInputWithValidation
								label='Stock Level:'
								value={editedStockQuantity}
								onChange={setEditedStockQuantity}
								required={true}
								error={stockQuantityError}
								type='number'
								testid='stock-quantity-input'
							/>
						</div>
						<ProductCard product={product} disabled={true} className='preview' />
					</div>
					<div className='btn-container'>
						<button className='secondary-btn' onClick={handleSave} data-testid='save-button'>Save</button>
						<button className='tertiary-btn' onClick={handleCancel} data-testid='cancel-button'>Cancel</button>
						<button className='primary-btn' onClick={handleDelete} data-testid='delete-button'>Delete</button>
					</div>
				</div>
			) : (
				<div>
					<div className='data-preview'>
						<div>
							<TextInputWithValidation
								label='Image URL/Path:'
								value={product.image}
								readonly={true}
							/>
							<TextInputWithValidation
								label='Product Name:'
								value={product.product_name}
								readonly={true}
							/>
							<TextInputWithValidation
								label='Description:'
								value={product.description}
								readonly={true}
							/>
							<TextInputWithValidation
								label='Price:'
								value={product.price}
								readonly={true}
							/>
							<TextInputWithValidation
								label='Stock Level:'
								value={product.stock_quantity}
								readonly={true}
							/>
						</div>
						<ProductCard product={product} disabled={true} className='preview' />
					</div>
					<div className='btn-container'>
						<button className='tertiary-btn' onClick={() => navigate('/products-home')} data-testid='back-button'>Back</button>
						<button className='secondary-btn' onClick={handleEdit} data-testid='edit-button'>Edit</button>
						<button className='primary-btn' onClick={handleDelete} data-testid='delete-button'>Delete</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default Product;
