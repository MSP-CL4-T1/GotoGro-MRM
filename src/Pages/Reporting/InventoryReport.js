import React, { useState } from 'react';
import Papa from 'papaparse';
import { fetchProducts } from '../../Supabase/supabaseService'; // Assuming you have a fetchProducts function similar to fetchSalesByDateRange
import './InventoryReport.css';  // You might need to create or adapt a CSS file for InventoryReport

function InventoryReport() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [filters, setFilters] = useState({
        product_id: { type: 'equal', value: '' },
        product_name: { type: 'contains', value: '' },
        description: { type: 'contains', value: '' },
        price: { type: 'range', value: '' },
        stock_quantity: { type: 'range', value: '' },
    });
    const [uiState, setUiState] = useState({
        isLoading: false,
        showNoProductsFound: false,
        showModal: false,
        showFilterMenu: false
    });
    const [columnVisibility, setColumnVisibility] = useState({
        productId: true,
        product_name: true,
        description: true,
        price: true,
        stock_quantity: true,
    });

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const updatedProducts = products.map(p => p.product_id === selectedProduct.product_id ? selectedProduct : p);
        setProducts(updatedProducts);
        setUiState(prev => ({ ...prev, showModal: false }));
    };

    const handleRowClick = (product) => {
        setSelectedProduct(product);
        setUiState(prev => ({ ...prev, showModal: true }));
    };

    const fetchInventory = async () => {
        try {
            setUiState(prev => ({ ...prev, isLoading: true }));
            const fetchedProducts = await fetchProducts();
            setProducts(fetchedProducts);

            if (fetchedProducts.length === 0) {
                setUiState(prev => ({ ...prev, showNoProductsFound: true }));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setUiState(prev => ({ ...prev, isLoading: false }));
        }
    };

    const handleExportToCSV = () => {
        const filteredInventory = filterInventory(sortProducts(products)).map(product => {
            let obj = {};
            if (columnVisibility.productId) obj.product_id = product.product_id;
            if (columnVisibility.product_name) obj.product_name = product.product_name;
            if (columnVisibility.description) obj.description = product.description;
            if (columnVisibility.price) obj.price = product.price;
            if (columnVisibility.stock_quantity) obj.stock_quantity = product.stock_quantity;
            return obj;
        });
        const csv = Papa.unparse(filteredInventory);
        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.setAttribute("hidden", "");
        a.setAttribute("href", url);
        a.setAttribute("download", "products_export.csv");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    

    // You would need to adjust the sorting logic and filtering logic below for the product fields.

    const sortProducts = (products) => {
        return [...products].sort((a, b) => {
            if (sortDirection === 'asc') return a.product_id - b.product_id;
            else return b.product_id - a.product_id;
        });
    };

    const resetFilters = () => {
        setFilters({
            product_id: { type: 'equal', value: '' },
            product_name: { type: 'contains', value: '' },
            description: { type: 'contains', value: '' },
            price: { type: 'range', value: '' },
            stock_quantity: { type: 'range', value: '' },
        });
    };

    const filterInventory = (products) => {
        return products.filter(product => {
            return Object.keys(filters).every(field => {
                const filter = filters[field];
                if (!filter.value || filter.value.trim() === '') return true;
                let productValue = product[field];
                let filterValue = filter.value;
                if (typeof productValue === 'number' && !isNaN(Number(filterValue))) {
                    filterValue = Number(filterValue);
                }
                if (typeof productValue === 'string' && typeof filterValue === 'string') {
                    productValue = productValue.toLowerCase().trim();
                    filterValue = filterValue.toLowerCase().trim();
                }
                switch (filter.type) {
                    case 'equal':
                        return productValue === filterValue;
                    case 'different':
                        return productValue !== filterValue;
                    case 'greater':
                        return productValue > filterValue;
                    case 'smaller':
                        return productValue < filterValue;
                    case 'range':
                        if (typeof filterValue === 'string') {
                            const [startStr, endStr] = filterValue.split('-').map(val => val.trim());
                            const start = startStr ? (typeof productValue === 'number' ? Number(startStr) : startStr) : null;
                            const end = endStr ? (typeof productValue === 'number' ? Number(endStr) : endStr) : null;
                            if (start && end) return productValue >= start && productValue <= end;
                            else if (start) return productValue >= start;
                            else if (end) return productValue <= end;
                            else return productValue;
                        } else {
                            return false;
                        }
                    default:
                        return true;
                }
            });
        });
    };

    const toggleSortDirection = () => {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    const toggleColumnVisibility = (columnKey) => {
        setColumnVisibility(prevState => ({ ...prevState, [columnKey]: !prevState[columnKey] }));
    };

    const displayedProducts = filterInventory(sortProducts(products));

    return (
        <div className="card">
            <h2>Inventory Report</h2>
            <div className="btn-container">
                <button type="button" onClick={fetchInventory}>Load Inventory</button>
                <button type="button" onClick={handleExportToCSV}>Export</button>
            </div>

            {uiState.isLoading ? <p>Loading...</p> : null}

            {displayedProducts.length > 0 ? (
                <ProductsTable
                    displayedProducts={displayedProducts}
                    handleRowClick={handleRowClick}
                    sortDirection={sortDirection}
                    columnVisibility={columnVisibility}
                    setShowFilterMenu={value => setUiState(prev => ({ ...prev, showFilterMenu: value }))}
                    resetFilters={resetFilters}
                    toggleSortDirection={toggleSortDirection}
                    toggleColumnVisibility={toggleColumnVisibility}
                />
            ) : uiState.showNoProductsFound ? (
                <p>No Products Found</p>
            ) : null}

            {uiState.showModal ? (
                <EditModal
                    selectedProduct={selectedProduct}
                    setShowModal={(value) => setUiState(prev => ({ ...prev, showModal: value }))}
                    handleEditSubmit={handleEditSubmit}
                    setSelectedProduct={setSelectedProduct}
                />
            ) : null}

            {uiState.showFilterMenu ? (
                <FilterMenu filters={filters} setFilters={setFilters} />
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
    toggleColumnVisibility
}) {
    return (
        <div>
            <button type="button" onClick={() => setShowFilterMenu(prev => !prev)}>
                Toggle Filter Menu
            </button>
            <button type="button" onClick={resetFilters}>
                Reset Filters
            </button>
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
                    {displayedProducts.map((product) => (
                        <tr key={product.product_id}>
                            <td onClick={() => handleRowClick('product_id', product.product_id)}>
                                {columnVisibility.productId ? product.product_id : null}
                            </td>
                            <td onClick={() => handleRowClick('product_name', product.product_name)}>
                                {columnVisibility.productName ? product.product_name : null}
                            </td>
                            <td onClick={() => handleRowClick('description', product.description)}>
                                {columnVisibility.description ? product.description : null}
                            </td>
                            <td onClick={() => handleRowClick('price', product.price)}>
                                {columnVisibility.price ? product.price : null}
                            </td>
                            <td onClick={() => handleRowClick('stock_quantity', product.stock_quantity)}>
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
    setShowModal,
    handleEditSubmit,
    setSelectedProduct
}) {
    return (
        <div className="modal">
            <h3>Edit {selectedProduct.key}</h3>
            <form onSubmit={handleEditSubmit}>
                <label>
                    {selectedProduct.key}:
                    <input 
                        type="text" 
                        value={selectedProduct.value} 
                        onChange={e => setSelectedProduct({...selectedProduct, value: e.target.value})}
                    />
                </label>
                <div>
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

function FilterMenu({ filters, setFilters, onApplyFilters }) {
    const updateFilter = (field, value, rangePart) => {
        const newFilters = { ...filters };
        const [startValue, endValue] = newFilters[field].value.split('-');
    
        if (startValue == null && endValue == null) {
            newFilters[field].value = "";
        } else if (rangePart === 'start') {
            newFilters[field].value = value + "-";
        } else if (rangePart === 'end') {
            newFilters[field].value = "0-" + value;
        } else {
            newFilters[field].value = value;
        }
        setFilters(newFilters);
    };

    return (
        <div className="filter-menu">
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
                                    <option value="equal">Equal to</option>
                                    <option value="different">Different from</option>
                                    <option value="greater">Greater than</option>
                                    <option value="smaller">Smaller than</option>
                                    <option value="range">Range</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder={isRange ? "Start value" : ""}
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
                                        type="text"
                                        placeholder="End value"
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
                    )
                })}
                <button type="button" onClick={onApplyFilters}>
                    Apply Filters
                </button>
            </form>
        </div>
    );
}

export default InventoryReport;
