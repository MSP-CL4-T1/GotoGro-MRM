import React, {useState, useEffect} from 'react';
import './Input.css';

/**
 * Component that renders a select input with validation
 * @param {Object} props - component properties
 * @param {string} props.value - selected value
 * @param {string} props.placeholder - select placeholder text
 * @param {boolean} props.required - whether the select input is required or not
 * @param {function} props.onChange - function to invoke with the selected value on change
 * @param {string[]} props.options - array of options for the select input
 * @param {string} [props.customErrorMsg] - custom error message to display when validation fails
 * @param {boolean} [props.showError] - whether to show the error message
 * @returns {JSX.Element} - returns JSX that renders the select input with validation
 */
function SelectWithValidation({
	value,
	placeholder = '',
	required = false,
	onChange,
	options,
	customErrorMsg = '',
	showError = false,
	testid = '',
}) {
	const [error, setError] = useState('');

	useEffect(() => {
		// Validate select value whenever it changes and showError is true
		if (showError) {
			const errorMessage = required && !value ? 'Required' : '';
			setError(errorMessage);
		}
	}, [value, required, showError]);

	const handleChange = event => {
		const selectedValue = event.target.value;

		if (onChange) {
			onChange(selectedValue);
		}

		// Clear the error when a new selection is made
		setError('');
	};

	return (
		<div className={`select-with-validation ${error || customErrorMsg ? 'has-error' : ''}`}>
			<select
				value={value}
				onChange={handleChange}
				data-testid={testid}
			>
				<option value='' disabled>
					{placeholder}
				</option>
				{options.map(option => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</select>
			{(showError && (error || customErrorMsg)) && (
				<span className='error-message'>{error || customErrorMsg}</span>
			)}
		</div>
	);
}

export {SelectWithValidation};
