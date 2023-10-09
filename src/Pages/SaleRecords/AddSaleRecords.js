import React, { useState } from 'react';
import TextInputWithValidation from '../../Components/TextInputWithValidation';
import { addSaleRecord } from '../../Supabase/supabaseService';
import { useNavigate } from 'react-router-dom';

function AddSaleRecords() {
    // State variables to store sale record information
    const [saleDate, setSaleDate] = useState('');
    const [memberId, setMemberId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    const navigate = useNavigate();

    const handleSave = async (e) => {
        e.preventDefault();
        setIsFormSubmitted(true);

        if (!saleDate || !memberId || !quantity || !totalAmount) {
            return;
        }

        try {
            const newSaleRecord = {
                sale_date: saleDate,
                member_id: memberId,
                quantity: quantity,
                total_amount: totalAmount
            };

            await addSaleRecord(newSaleRecord);
            navigate('/sale-records-home');
        } catch (error) {
            console.error(error)
        }
    };

    const handleCancel = () => {
        navigate('/sale-records-home');
    }

    return (
        <div className="card">
            <h2>Add Sale Record</h2>
            <form onSubmit={handleSave} className='form-container'>
                <div className="label-input">
                    <strong>Sale Date:</strong><span className="required-star"> *</span>
                    <TextInputWithValidation
                        type="date"
                        value={saleDate}
                        parentOnChange={setSaleDate}
                        required={true}
                        showError={isFormSubmitted}
                        testid="sale-date-input"
                    />
                </div>
                <div className="label-input">
                    <strong>Member ID:</strong><span className="required-star"> *</span>
                    <TextInputWithValidation
                        type="number"
                        value={memberId}
                        parentOnChange={setMemberId}
                        required={true}
                        showError={isFormSubmitted}
                        testid="member-id-input"
                    />
                </div>
                <div className="label-input">
                    <strong>Quantity:</strong><span className="required-star"> *</span>
                    <TextInputWithValidation
                        type="number"
                        value={quantity}
                        parentOnChange={setQuantity}
                        required={true}
                        showError={isFormSubmitted}
                        testid="quantity-input"
                    />
                </div>
                <div className="label-input">
                    <strong>Total Amount:</strong><span className="required-star"> *</span>
                    <TextInputWithValidation
                        type="number"
                        value={totalAmount}
                        parentOnChange={setTotalAmount}
                        required={true}
                        showError={isFormSubmitted}
                        testid="total-amount-input"
                    />
                </div>
                <div className='btn-container'>
                    <button type="submit" data-testid="add-button">Add Sale Record</button>
                    <button type="cancel" data-testid="cancel-button" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default AddSaleRecords;