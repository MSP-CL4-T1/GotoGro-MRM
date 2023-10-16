import React from 'react';
import {Link} from 'react-router-dom';
import './Product.css';

function ProductCard({product, disabled}) {
	const saveSelectedProductToLocalStorage = async product => {
		localStorage.setItem('selectedProduct', JSON.stringify(product));
		localStorage.setItem('editingProduct', JSON.stringify(true));
	};

	// Conditionally render the Link based on the "disabled" prop
	const imageLink = disabled ? (
		<img src={product.image} alt={product.product_name} />
	) : (
		<Link to={'/product'} onClick={() => saveSelectedProductToLocalStorage(product)}>
			<img src={product.image} alt={product.product_name} />
		</Link>
	);

	return (
		<div className='product-container'>
			<div className='product-card'>
				{imageLink}
				<p className='product-name'>{product.product_name}</p>
				<p className='product-desc'>{product.description}</p>
				<p className='product-price'>$ {product.price}</p>
				<p className='product-stock-quantity'>{product.stock_quantity} Left</p>
			</div>
		</div>
	);
}

export default ProductCard;
