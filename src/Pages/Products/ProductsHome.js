import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {searchProductsByName} from '../../Supabase/supabaseService';
import ProductCard from './ProductCard';

function ProductsHome() {
	const [products, setProducts] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [showNoProductsFound, setShowNoProductsFound] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleSearch = async e => {
		e.preventDefault();

		try {
			setIsLoading(true);
			const searchResults = await searchProductsByName(searchTerm);
			setProducts(searchResults);

			// Show "No Products Found" if no results
			setShowNoProductsFound(searchResults.length === 0);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClear = () => {
		setSearchTerm('');
		setProducts([]);
		setShowNoProductsFound(false); // Hide "No Products Found" on clear
	};

	return (
		<div className='card'>
			<h2>Products Home</h2>
			<div>
				<input
					className='search-input'
					type='text'
					placeholder='Search products...'
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
				/>
				<div className='btn-container'>
					<button className='primary-btn' onClick={handleSearch}>Search</button>
					<button className='tertiary-btn' onClick={handleClear}>Clear</button>
					<Link className='link-btn secondary-btn' to='/add-product'>Add New Product</Link>
				</div>
			</div>
			{isLoading ? (
				<p>Loading...</p>
			) : products.length > 0 ? (
				<div className='products-container'>
					{products.map((product, index) => (
						<ProductCard key={index} product={product} disabled={false} />
					))}
				</div>
			) : showNoProductsFound ? (
				<p>No Products Found</p>
			) : null}
		</div>
	);
}

export default ProductsHome;
