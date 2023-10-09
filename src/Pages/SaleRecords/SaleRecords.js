import React, { useState } from 'react';
import { softDeleteSaleRecord, updateSaleRecord } from '../../Supabase/supabaseService';
import { useNavigate } from 'react-router-dom';
import TextInputWithValidation from '../../Components/TextInputWithValidation';

function SaleRecord() {
    const [saleRecord, setSaleRecord] = useState(JSON.parse(localStorage.getItem('selectedSaleRecord')));
    const [isEditing, setIsEditing] = useState(false);
    const [editedMemberID, setEditedMemberID] = useState(saleRecord.member_id);
    const [editedProductID, setEditedProductID] = useState(saleRecord.product_id);
    const [editedSaleDate, setEditedSaleDate] = useState(saleRecord.sale_date);
    const [editedQuantity, setEditedQuantity] = useState(saleRecord.quantity);
    const [editedTotalAmount, setEditedTotalAmount] = useState(saleRecord.total_amount);

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
                        <div className='label-input'>
                            <strong>Member ID:</strong><span className="required-star"> *</span>
                            <TextInputWithValidation
                                required={true}
                                value={editedMemberID}
                                regex={/^(?!0)\d+$/}
                                regexErrorMsg="Invalid Character"
                            />
                        </div>
                        <div className='label-input'>
                            <strong>Product ID:</strong><span className="required-star"> *</span>
                            <TextInputWithValidation
                                required={true}
                                value={editedProductID}
                                regex={/^(?!0)\d+$/}
                                regexErrorMsg="Invalid Character"
                            />
                        </div>
                        <div className='label-input'>
                            <strong>Sale Date:</strong><span className="required-star"> *</span>
                            <TextInputWithValidation
                                regex={/^\d{4}-\d{2}-\d{2}$/}
                                regexErrorMsg="Invalid Date"
                                value={editedSaleDate}
                                required={true}
                            />
                        </div>
                        <div className='label-input'>
                            <strong>Quantity:</strong>
                            <TextInputWithValidation
                                regex={/^(?!0)\d+$/}
                                regexErrorMsg="Invalid Quantity"
                                value={editedQuantity}
                                required={true}
                            />
                        </div>
                        <div className='label-input'>
                            <strong>Total Amount:</strong>
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
                        <button onClick={handleEdit} data-testid="edit-button">Edit</button>
                        <button onClick={handleDelete} data-testid="delete-button">Delete</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SaleRecord;
