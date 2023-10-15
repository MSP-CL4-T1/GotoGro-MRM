import React, {useState, useEffect} from 'react';
import './Input.css';

/**
 * Validates input value based on required and regex pattern
 * @param {string} value - input value to validate
 * @param {boolean} required - whether the input is required or not
 * @param {RegExp} regex - optional regular expression that input value should match
 * @param {string} regexErrorMsg - error message to display when regex validation fails
 * @returns {string} - returns an error message if validation fails, otherwise empty string
 */
function validateInput(value, required, regex, regexErrorMsg) {
	if (!value && required) {
		return 'Required';
	}

	if (regex) {
		const isValid = regex.test(value);
		return isValid ? '' : regexErrorMsg;
	}
}

/**
 * Component that renders an input with validation
 * @param {Object} props - component properties
 * @param {string} [props.type="text"] - input type
 * @param {string} props.placeholder - input placeholder text
 * @param {boolean} props.required - whether the input is required or not
 * @param {RegExp} [props.regex] - optional regular expression that input value should match
 * @param {string} [props.regexErrorMsg] - error message to display when regex validation fails
 * @param {function} props.parentOnChange - function to invoke with the input value on change
 * @param {boolean} [props.readonly] - whether the input is read-only or not
 * @param {string} [props.customErrorMsg] - custom error message to display when validation fails
 * @param {boolean} [props.showError] - whether to show the error message
 * @returns {JSX.Element} - returns JSX that renders the input with validation
 */
function TextInputWithValidation({
	type = 'text',
	value = '',
	placeholder,
	required = false,
	regex = '',
	regexErrorMsg = 'Invalid input',
	parentOnChange,
	readonly = false,
	customErrorMsg = '',
	showError = false, // New prop to conditionally show the error message
	testid = '',
}) {
	const [inputValue, setInputValue] = useState(value);
	const [error, setError] = useState('');

	useEffect(() => {
		// Validate input value whenever it changes and showError is true
		if (showError) {
			const errorMessage = validateInput(inputValue, required, regex, regexErrorMsg);
			setError(errorMessage);
		}
	}, [inputValue, required, regex, regexErrorMsg, showError]);

	const handleChange = event => {
		const newInputValue = event.target.value;
		setInputValue(newInputValue);

		// Clear the error when the user starts typing again
		if (newInputValue && error) {
			setError('');
		}

		if (parentOnChange) {
			parentOnChange(newInputValue);
		}
	};

	const handleBlur = () => {
		// Show the error when the input field is blurred
		if (required && !inputValue) {
			setError('Required');
		}
	};

	return (
		<div className={`input-with-validation ${error || customErrorMsg ? 'has-error' : ''}`}>
			<input
				type={type}
				placeholder={placeholder}
				className={`text-input-validation ${readonly ? 'readonly' : ''}`}
				value={inputValue}
				onChange={handleChange}
				onBlur={handleBlur}
				readOnly={readonly}
				data-testid={testid}
			/>
			{(showError && (error || customErrorMsg)) && <span className='error-message'>{error || customErrorMsg}</span>}
		</div>
	);
}

export {TextInputWithValidation, validateInput};
