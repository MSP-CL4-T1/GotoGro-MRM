import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {addProduct} from '../../Supabase/supabaseService';
import './Product.css';
import TextInputWithValidation from '../../Components/TextInputWithValidation';
import ProductCard from './ProductCard';
import {validateInput} from '../../utils';

function AddProduct() {
	const [productName, setProductName] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');
	const [stockQuantity, setStockQuantity] = useState('');
	const [image, setImage] = useState('');

	const [productNameError, setProductNameError] = useState(validateInput(productName, true));
	const [descriptionError, setDescriptionError] = useState(validateInput(description, true));
	const [priceError, setPriceError] = useState(validateInput(price, true));
	const [stockQuantityError, setStockQuantityError] = useState(validateInput(stockQuantity, true));
	const [imageError, setImageError] = useState(validateInput(image, true));

	const [newProduct, setNewProduct] = useState({
		product_name: '',
		description: '',
		price: 0,
		stock_quantity: 0,
		image: '',
	});

	const [previewImage, setPreviewImage] = useState('images/noImageYet.png');

	const previewProduct = {
		product_name: newProduct.product_name ? newProduct.product_name : 'Product Name',
		description: newProduct.description ? newProduct.description : 'Description',
		price: newProduct.price ? newProduct.price : 0,
		stock_quantity: newProduct.stock_quantity ? newProduct.stock_quantity : 0,
		image: previewImage,
	};

	const navigate = useNavigate();

	const updateNewProduct = () => {
		const updatedProduct = {
			product_name: productName,
			description,
			price,
			stock_quantity: stockQuantity,
			image,
		};
		setNewProduct(updatedProduct);
	};

	useEffect(() => {
		setNewProduct({
			product_name: productName,
			description,
			price,
			stock_quantity: stockQuantity,
			image,
		});
	}, [productName, description, price, stockQuantity, image]);

	const handleSave = async e => {
		e.preventDefault();

		if (productNameError || descriptionError || priceError || stockQuantityError || imageError) {
			return;
		}

		try {
			const newId = await addProduct(newProduct);
			localStorage.setItem('selectedProduct', JSON.stringify({product_id: newId, ...newProduct}));
			navigate('/product');
		} catch (error) {
			console.error(error);
		}
	};

	const handleCancel = () => {
		navigate('/products-home');
	};

	const handleImageChange = value => {
		// Check if the entered image URL is valid
		const img = new Image();
		img.src = value;

		img.onerror = () => {
			// Image URL is not valid, set it to the default
			setPreviewImage('images/invalidImage.png');
		};

		// Update the image state as the user types
		setImage(value);
		setPreviewImage(value);
		updateNewProduct();
	};

	// Use useEffect to calculate validation errors as the inputs change
	useEffect(() => {
		setProductNameError(
			validateInput(productName, true),
		);
	}, [productName]);

	useEffect(() => {
		setDescriptionError(
			validateInput(description, true),
		);
	}, [description]);

	useEffect(() => {
		setPriceError(
			validateInput(price, true),
		);
	}, [price]);

	useEffect(() => {
		setStockQuantityError(
			validateInput(stockQuantity, true),
		);
	}, [stockQuantity]);

	useEffect(() => {
		setImageError(
			validateInput(image, true),
		);
	}, [image]);

	return (
		<div className='card'>
			<h2>Add Product</h2>
			<form onSubmit={handleSave}>
				<div className='data-preview'>
					<div>
						<TextInputWithValidation
							label='Image URL/Path:'
							value={newProduct.image}
							onChange={handleImageChange}
							required={true}
							error={imageError}
						/>
						<TextInputWithValidation
							label='Product Name:'
							value={newProduct.product_name}
							onChange={value => {
								setProductName(value);
								updateNewProduct();
							}}
							required={true}
							error={productNameError}
						/>
						<TextInputWithValidation
							label='Description:'
							value={newProduct.description}
							onChange={value => {
								setDescription(value);
								updateNewProduct();
							}}
							required={true}
							error={descriptionError}
						/>
						<TextInputWithValidation
							label='Price:'
							value={newProduct.price}
							onChange={value => {
								setPrice(value);
								updateNewProduct();
							}}
							required={true}
							error={priceError}
						/>
						<TextInputWithValidation
							label='Stock Level:'
							value={newProduct.stock_quantity}
							onChange={value => {
								setStockQuantity(value);
								updateNewProduct();
							}}
							required={true}
							error={stockQuantityError}
						/>
					</div>
					<ProductCard product={previewProduct} disabled={true} className='preview' />
				</div>
				<div className='btn-container'>
					<button className='secondary-btn' type='submit' data-testid='save-button'>Save</button>
					<button className='tertiary-btn' type='cancel' data-testid='cancel-button' onClick={handleCancel}>Cancel</button>
				</div>
			</form>
		</div>
	);
}

export default AddProduct;
