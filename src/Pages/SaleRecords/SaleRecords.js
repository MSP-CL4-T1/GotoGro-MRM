import React, { useState } from 'react';
import { softDeleteSaleRecord, updateSaleRecord } from '../../Supabase/supabaseService'; // Import your Supabase service functions
import { useNavigate } from 'react-router-dom';
import TextInputWithValidation from '../../Components/TextInputWithValidation'; // You can create a custom input component for validation

/**
 * SaleRecord component for displaying sale record details and allowing edits.
 * @returns {JSX.Element} The rendered JSX element.
 */
function SaleRecords() {
    const [saleRecord, setSaleRecord] = useState(JSON.parse(localStorage.getItem('selectedSaleRecord')));
    const [isEditing, setIsEditing] = useState(false);
    const [editedSaleDate, setEditedSaleDate] = useState(saleRecord.sale_date);
    const [editedQuantity, setEditedQuantity] = useState(saleRecord.quantity);
    const [editedTotalAmount, setEditedTotalAmount] = useState(saleRecord.total_amount);

    const navigate = useNavigate();

    // Turns the component into editing mode
    const handleEdit = () => {
        setIsEditing(true);
    };

    // Cancels the changes and resets the values to original values
    const handleCancel = () => {
        setIsEditing(false);
        setEditedSaleDate(saleRecord.sale_date);
        setEditedQuantity(saleRecord.quantity);
        setEditedTotalAmount(saleRecord.total_amount);
    };

    // Saves the changes to the sale record by calling the updateSaleRecord function from supabaseService
    const handleSave = async () => {
        try {
            const updatedSaleRecord = {
                sale_id: saleRecord.sale_id,
                sale_date: editedSaleDate,
                quantity: editedQuantity,
                total_amount: editedTotalAmount
                // Add other fields as needed
            };

            await updateSaleRecord(updatedSaleRecord);
            setSaleRecord(updatedSaleRecord);
            setIsEditing(false);

        } catch (error) {
            console.error(error);
        }
    };

    // Soft deletes the sale record and redirects the user to the SaleRecordsHome screen
    const handleDelete = async () => {
        try {
            await softDeleteSaleRecord(saleRecord);
            localStorage.removeItem('selectedSaleRecord');
            navigate('/sale-records-home'); // Replace with the correct route
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
                            <strong>Sale Date:</strong><span className="required-star"> *</span>
                            <TextInputWithValidation
                                required={true}
                                value={editedSaleDate}
                                // Add validation regex and error message as needed
                            />
                        </div>
                        <div className='label-input'>
                            <strong>Quantity:</strong><span className="required-star"> *</span>
                            <TextInputWithValidation
                                required={true}
                                value={editedQuantity}
                                // Add validation regex and error message as needed
                            />
                        </div>
                        <div className='label-input'>
                            <strong>Total Amount:</strong><span className="required-star"> *</span>
                            <TextInputWithValidation
                                required={true}
                                value={editedTotalAmount}
                                // Add validation regex and error message as needed
                            />
                        </div>
                        {/* Add other fields as needed */}
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
                        {/* Display other fields as needed */}
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

export default SaleRecords;
