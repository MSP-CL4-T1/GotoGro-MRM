import React, { useEffect, useState } from 'react';
import { fetchMembers, fetchProducts, softDeleteSaleRecord, updateSaleRecord } from '../../Supabase/supabaseService';
import { useNavigate } from 'react-router-dom';
import { TextInputWithValidation } from '../../Components/TextInputWithValidation';
import './SaleRecords.css';
function SaleRecord() {
    const [saleRecord, setSaleRecord] = useState(JSON.parse(localStorage.getItem('selectedSaleRecord')));
    const [isEditing, setIsEditing] = useState(false);
    const [editedMemberID, setEditedMemberID] = useState(saleRecord.member_id);
    const [editedProductID, setEditedProductID] = useState(saleRecord.product_id);
    const [editedSaleDate, setEditedSaleDate] = useState(saleRecord.sale_date);
    const [editedQuantity, setEditedQuantity] = useState(saleRecord.quantity);
    const [editedTotalAmount, setEditedTotalAmount] = useState(saleRecord.total_amount);
    const [members, setMembers] = useState([]);
    const [products, setProducts] = useState([]);

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

    const handleSave = async () => {
        try {
            const updatedSaleRecord = {
                sale_id: saleRecord.sale_id, // Replace with the correct property for sale_id
                member_id: editedMemberID,
                product_id: editedProductID,
                sale_date: editedSaleDate,
                quantity: editedQuantity,
                total_amount: editedTotalAmount
            };

            await updateSaleRecord(updatedSaleRecord);
            setSaleRecord(updatedSaleRecord);
            setIsEditing(false);

        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async () => {
        try {
            await softDeleteSaleRecord(saleRecord);
            localStorage.removeItem('selectedSaleRecord');
            navigate('/sale-records-home');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='card'>
            <h2>Sale Record Details</h2>
            {isEditing ? (
                <div>
                    <div className='form-container'>
                        <div className='sales-label-input'>
                            <div className={"required-container"}> <strong>Member ID</strong><span className="required-star"> *</span> </div>
                            <select
                                value={editedMemberID}
                                onChange={(e) => setEditedMemberID(e.target.value)}
                            >
                                {members.map(member => (
                                    <option key={member.member_id} value={member.member_id} className={"member-input"}>
                                        {member.first_name} {member.last_name} ({member.member_id})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='label-input'>
                            <div className={"required-container"}> <strong>Product ID</strong><span className="required-star"> *</span> </div>
                            <select
                                value={editedProductID}
                                onChange={(e) => setEditedProductID(e.target.value)}
                            >
                                {products.map(product => (
                                    <option key={product.product_id} value={product.product_id} className={"product-input"}>
                                        {product.product_name} ({product.product_id})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='label-input'>
                            <div className={"required-container"}><strong>Sale Date</strong><span className="required-star"> *</span></div>
                            <TextInputWithValidation
                                regex={/^\d{4}-\d{2}-\d{2}$/}
                                regexErrorMsg="Invalid Date"
                                value={editedSaleDate}
                                required={true}
                            />
                        </div>
                        <div className='label-input'>
                            <strong>Quantity</strong>
                            <TextInputWithValidation
                                regex={/^(?!0)\d+$/}
                                regexErrorMsg="Invalid Quantity"
                                value={editedQuantity}
                                required={true}
                            />
                        </div>
                        <div className='label-input'>
                            <strong>Total Amount</strong>
                            <TextInputWithValidation
                                regex={/^(?!0)\d+$/}
                                regexErrorMsg="Invalid Total Amount"
                                value={editedTotalAmount}
                                required={true}
                            />
                        </div>
                    </div>
                    <div className='btn-container'>
                        <button onClick={handleSave} data-testid="save-button">Save</button>
                        <button onClick={handleCancel} data-testid="cancel-button">Cancel</button>
                    </div>
                </div>
            ) : (
                <div>
                    <div className='form-container'>
                        <div className='label-input'>
                            <strong>Member ID:</strong>
                            <TextInputWithValidation
                                value={saleRecord.member_id}
                                readonly={true}
                            />
                        </div>
                        <div className='label-input'>
                            <strong>Product ID:</strong>
                            <TextInputWithValidation
                                value={saleRecord.product_id}
                                readonly={true}
                            />
                        </div>
                        <div className='label-input'>
                            <strong>Sale Date:</strong>
                            <TextInputWithValidation
                                value={saleRecord.sale_date}
                                readonly={true}
                            />
                        </div>
                        <div className='label-input'>
                            <strong>Quantity:</strong>
                            <TextInputWithValidation
                                value={saleRecord.quantity}
                                readonly={true}
                            />
                        </div>
                        <div className='label-input'>
                            <strong>Total Amount:</strong>
                            <TextInputWithValidation
                                value={saleRecord.total_amount}
                                readonly={true}
                            />
                        </div>
                    </div>
                    <div className='btn-container'>
                        <button onClick={() => navigate('/sale-records-home')} data-testid="back-button">Back</button>
                        <button onClick={handleEdit} data-testid="edit-button">Edit</button>
                        <button onClick={handleDelete} data-testid="delete-button">Delete</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SaleRecord;
