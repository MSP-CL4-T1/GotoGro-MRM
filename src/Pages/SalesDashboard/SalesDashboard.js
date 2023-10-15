import React, {useEffect, useState} from 'react';
import {Line, Pie} from 'react-chartjs-2';
import {LineElement, PointElement, Title, Tooltip, Legend, Chart} from 'chart.js';
import './SalesDashboard.css';
import {
	addRandomSaleRecords,
	fetchHotProductsFromDB,
	fetchProducts,
	getSalesDataForProduct,
} from '../../Supabase/supabaseService';

Chart.register(LineElement, PointElement, Title, Tooltip, Legend);

const SalesDashboard = () => {
	const [products, setProducts] = useState([]);
	const [selectedProductId, setSelectedProductId] = useState(null);
	const [salesData, setSalesData] = useState([]);
	const [isAdding, setIsAdding] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [, setHotProducts] = useState([]);

	useEffect(() => {
		const getProducts = async () => {
			const fetchedProducts = await fetchProducts();
			setProducts(fetchedProducts);
			if (fetchedProducts.length > 0) {
				setSelectedProductId(fetchedProducts[0].product_id);
			}

			setIsLoading(false);
		};

		getProducts();
	}, []);

	useEffect(() => {
		if (selectedProductId) {
			const getSalesData = async () => {
				setIsLoading(true);
				const fetchedSalesData = await getSalesDataForProduct(selectedProductId);
				setSalesData(fetchedSalesData);
				setIsLoading(false);
			};

			getSalesData();
		}
	}, [selectedProductId]);

	useEffect(() => {
		const fetchHotProducts = async () => {
			const fetchedHotProducts = await fetchHotProductsFromDB();
			setHotProducts(fetchedHotProducts);
		};

		fetchHotProducts();
	}, []);

	const handleProductChange = e => {
		setSelectedProductId(e.target.value);
	};

	const handleAddRandomSales = async () => {
		setIsAdding(true);
		try {
			await addRandomSaleRecords(selectedProductId);
			const fetchedSalesData = await getSalesDataForProduct(selectedProductId);
			setSalesData(fetchedSalesData);
		} catch (error) {
			console.error('Error adding random sales:', error);
		}

		setIsAdding(false);
	};

	const data = {
		labels: salesData.map(sale => sale.sale_date),
		datasets: [{
			label: 'Sales Over Time',
			data: salesData.map(sale => sale.quantity),
			fill: false,
			borderColor: '#4BC0C0',
			tension: 0.1,
		}],
	};

	if (isLoading) {
		return <div className='sales-dashboard loading'>Loading...</div>;
	}

	if (products.length === 0) {
		return <div className='sales-dashboard empty'>No products available.</div>;
	}

	return (
		<div className='sales-dashboard'>
			<h1>Sales Dashboard</h1>
			<label htmlFor='productSelector'>Select Product: </label>
			<select id='productSelector' onChange={handleProductChange} value={selectedProductId}>
				{products.map(product => (
					<option key={product.product_id} value={product.product_id}>{product.product_name}</option>
				))}
			</select>
			{salesData.length === 0 ? (
				<p>No sales data available for this product.</p>
			) : (
				salesData.length === 1 ? (
					<p>Insufficient data to plot graph. Only one sale record available.</p>
				) : (
					<Line data={data} />
				)
			)}
			<button className='secondary-btn' onClick={handleAddRandomSales} disabled={isAdding}>
				{isAdding ? 'Adding Records...' : 'Add Random Sale Records'}
			</button>
			<HotProducts />
		</div>
	);
};

const HotProducts = () => {
	const [hotProducts, setHotProducts] = useState([]);

	useEffect(() => {
		const fetchHotProducts = async () => {
			const fetchedHotProducts = await fetchHotProductsFromDB();
			setHotProducts(fetchedHotProducts);
		};

		fetchHotProducts();
	}, []);

	const hotProductsData = {
		labels: hotProducts.map(p => p.product_name),
		datasets: [{
			label: 'Total Units Sold',
			data: hotProducts.map(p => p.totalSold),
			backgroundColor: hotProducts.map(() => '#' + Math.floor(Math.random() * 16777215).toString(16)),
			borderWidth: 1,
		}],
	};

	const optionsPieDoughnut = {
		plugins: {
			legend: {
				position: 'bottom',
				labels: {
					filter(item, chart) {
						return chart.datasets[0].data[item.index] > 0;
					},
				},
			},
		},
		animation: {
			animateScale: true,
			animateRotate: true,
			duration: 1000,
		},
	};

	return (
		<div className='sales-dashboard'>
			<div className='chart-container'>
				<h2>Top Selling Products</h2>
				<Pie
					data={hotProductsData}
					options={optionsPieDoughnut}
				/>
			</div>
		</div>
	);
};

export default SalesDashboard;
