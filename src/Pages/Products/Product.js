import React, { useState, useEffect } from "react";
import { softDeleteProduct, updateProduct } from '../../Supabase/supabaseService';
import { useNavigate } from 'react-router-dom';
import TextInputWithValidation from '../../Components/TextInputWithValidation';
import ProductCard from "./ProductCard";
import './Product.css'

function Product() {
    const initialProductData = JSON.parse(localStorage.getItem('selectedProduct'))
    const [product, setProduct] = useState(initialProductData);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProductName, setEditedProductName] = useState(product.product_name);
    const [editedDescription, setEditedDescription] = useState(product.description);
    const [editedPrice, setEditedPrice] = useState(product.price);
    const [editedStockQuantity, setEditedStockQuantity] = useState(product.stock_quantity);
    const [editedImage, setEditedImage] = useState(product.image);

    const navigate = useNavigate();

    useEffect(() => {
        setProduct({
            product_id: product.product_id,
            product_name: editedProductName,
            description: editedDescription,
            price: editedPrice,
            stock_quantity: editedStockQuantity,
            image: editedImage
        });
    }, [product.product_id, editedProductName, editedDescription, editedPrice, editedStockQuantity, editedImage]);

    // turns the component into editing mode
    const handleEdit = () => {
        setIsEditing(true);
    };

    // cancels the changes and resets the values to original values
    const handleCancel = () => {
        setIsEditing(false);
        setEditedProductName(initialProductData.product_name);
        setEditedDescription(initialProductData.description);
        setEditedPrice(initialProductData.price);
        setEditedStockQuantity(initialProductData.stock_quantity);
        setEditedImage(initialProductData.image);
    };

    // saves the changes to the product by calling the updateProduct function from supabaseService
    const handleSave = async () => {
        try {
            const updatedProduct = {
                product_id: product.product_id,
                product_name: product.product_name,
                description: product.description,
                price: product.price,
                stock_quantity: product.stock_quantity,
                image: product.image
            };

            await updateProduct(updatedProduct);
            setProduct(updatedProduct);
            setIsEditing(false);

        } catch (error) {
            console.error(error)
        }
    };

    // soft deletes the product and redirects the user to the ProductsHome screen
    const handleDelete = async () => {
        try {
            await softDeleteProduct(product);
            localStorage.removeItem('selectedProduct');
            navigate('/products-home');
        } catch (error) {
            console.error(error)
        }
    };

    return (
        <div className='card'>
            <h2>Product Details</h2>
            {isEditing ? (
                <div>
                    <div className='data-preview'>
                        <div>
                            <div className='label-input'>
                                <strong>Image Path/URL:</strong><span className="required-star"> *</span>
                                <TextInputWithValidation
                                    required={true}
                                    value={editedImage}
                                    parentOnChange={setEditedImage}
                                    testid="image-input"
                                />
                            </div>
                            <div className='label-input'>
                                <strong>Product Name:</strong><span className="required-star"> *</span>
                                <TextInputWithValidation
                                    required={true}
                                    value={editedProductName}
                                    parentOnChange={setEditedProductName}
                                    testid="product-name-input"
                                />
                            </div>
                            <div className='label-input'>
                                <strong>Description:</strong><span className="required-star"> *</span>
                                <TextInputWithValidation
                                    required={true}
                                    value={editedDescription}
                                    parentOnChange={setEditedDescription}
                                    testid="description-input"
                                />
                            </div>
                            <div className='label-input'>
                                <strong>Price:</strong><span className="required-star"> *</span>
                                <TextInputWithValidation
                                    value={editedPrice}
                                    parentOnChange={setEditedPrice}
                                    required={true}
                                    testid="price-input"
                                    type="number"
                                />
                            </div>
                            <div className='label-input'>
                                <strong>Stock Quantity:</strong><span className="required-star"> *</span>
                                <TextInputWithValidation
                                    value={editedStockQuantity}
                                    required={true}
                                    type="number"
                                    testid="stock-quantity-input"
                                    parentOnChange={setEditedStockQuantity}
                                />
                            </div>
                        </div>
                        <ProductCard product={product} disabled={true} className="preview" />
                    </div>
                    <div className='btn-container'>
                        <button onClick={handleSave} data-testid="save-button">Save</button>
                        <button onClick={handleCancel} data-testid="cancel-button">Cancel</button>
                    </div>
                </div>
            ) : (
                <div>
                    <div className='data-preview'>
                        <div>
                            <div className='label-input'>
                                <strong>Image Path/URL:</strong>
                                <TextInputWithValidation
                                    value={product.image}
                                    readonly={true}
                                />
                            </div>
                            <div className='label-input'>
                                <strong>Product Name:</strong>
                                <TextInputWithValidation
                                    value={product.product_name}
                                    readonly={true}
                                />
                            </div>
                            <div className='label-input'>
                                <strong>Description:</strong>
                                <TextInputWithValidation
                                    value={product.description}
                                    readonly={true}
                                />
                            </div>
                            <div className='label-input'>
                                <strong>Price:</strong>
                                <TextInputWithValidation
                                    value={product.price}
                                    readonly={true}

                                />
                            </div>
                            <div className='label-input'>
                                <strong>Stock Quantity:</strong>
                                <TextInputWithValidation
                                    value={product.stock_quantity}
                                    readonly={true}
                                />
                            </div>
                        </div>
                        <ProductCard product={product} disabled={true} className="preview" />
                    </div>
                    <div className='btn-container'>
                        <button onClick={handleEdit} data-testid="edit-button">Edit</button>
                        <button onClick={handleDelete} data-testid="delete-button">Delete</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Product;