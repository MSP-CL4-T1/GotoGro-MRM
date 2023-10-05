import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../../Supabase/supabaseService";
import "./Product.css";
import TextInputWithValidation from "../../Components/TextInputWithValidation";
import ProductCard from "./ProductCard";

function AddProduct() {
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [stockQuantity, setStockQuantity] = useState(0);
    const [image, setImage] = useState('');

    const [newProduct, setNewProduct] = useState({
        product_name: '',
        description: '',
        price: 0,
        stock_quantity: 0,
        image: ''
    })

    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [formErrorMessage, setFormErrorMessage] = useState(""); // State variable for form error message
    const navigate = useNavigate();

    const updateNewProduct = () => {
        const updatedProduct = {
            product_name: productName,
            description,
            price,
            stock_quantity: stockQuantity,
            image
        };
        setNewProduct(updatedProduct);
    };

    const validateForm = () => {
        if (
            !newProduct.product_name ||
            !newProduct.description ||
            !newProduct.price ||
            !newProduct.stock_quantity ||
            !newProduct.image
        ) {
            setFormErrorMessage("Please fill out all the fields.");
            return false;
        }

        setFormErrorMessage(""); // Clear the error message if all fields are filled out
        return true;
    };

    useEffect(() => {
        setNewProduct({
            product_name: productName,
            description,
            price,
            stock_quantity: stockQuantity,
            image
        });
    }, [productName, description, price, stockQuantity, image]);

    const handleSave = async (e) => {
        e.preventDefault();
        setIsFormSubmitted(true);

        const isValid = validateForm();

        if (isValid) {
            try {
                await addProduct(newProduct);
                localStorage.setItem('selectedProduct', JSON.stringify(newProduct));
                navigate('/product');
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleCancel = () => {
        navigate('/products-dashboard');
    }

    return (
        <div className="card">
            <h2>Add Product</h2>
            <form onSubmit={handleSave} className='form-container'>
                <div>
                    <div className="label-input">
                        <strong>Image URL/Path:</strong><span className="required-star"> *</span>
                        <TextInputWithValidation
                            value={newProduct.image}
                            parentOnChange={(value) => {
                                setImage(value);
                                updateNewProduct();
                            }}
                            required={true}
                            showError={isFormSubmitted}
                        />
                    </div>
                    <div className="label-input">
                        <strong>Product Name:</strong><span className="required-star"> *</span>
                        <TextInputWithValidation
                            value={newProduct.product_name}
                            parentOnChange={(value) => {
                                setProductName(value);
                                updateNewProduct();
                            }}
                            required={true}
                            showError={isFormSubmitted}
                        />
                    </div>
                    <div className="label-input">
                        <strong>Description:</strong><span className="required-star"> *</span>
                        <TextInputWithValidation
                            value={newProduct.description}
                            parentOnChange={(value) => {
                                setDescription(value);
                                updateNewProduct();
                            }}
                            required={true}
                            showError={isFormSubmitted}
                        />
                    </div>
                    <div className="label-input">
                        <strong>Price:</strong><span className="required-star"> *</span>
                        <TextInputWithValidation
                            type="number"
                            value={newProduct.price}
                            parentOnChange={(value) => {
                                setPrice(value);
                                updateNewProduct();
                            }}
                            required={true}
                            showError={isFormSubmitted}
                        />
                    </div>
                    <div className="label-input">
                        <strong>Stock Level:</strong><span className="required-star"> *</span>
                        <TextInputWithValidation
                            type="number"
                            value={newProduct.stock_quantity}
                            parentOnChange={(value) => {
                                setStockQuantity(value);
                                updateNewProduct();
                            }}
                            required={true}
                            showError={isFormSubmitted}
                        />
                    </div>
                </div>
                <ProductCard product={newProduct} className="preview" />
                <div className='btn-container'>
                    <button type="submit" data-testid="save-button">Save</button>
                    <button type="cancel" data-testid="cancel-button" onClick={handleCancel}>Cancel</button>
                </div>
                {formErrorMessage && (
                    <span className="error-message">{formErrorMessage}</span>
                )}
            </form>
        </div>
    );
}

export default AddProduct;
