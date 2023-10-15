import React from 'react';
import './Input.css';

function TextInputWithValidation({
	type = 'text',
	label = '',
	value = '',
	placeholder,
	required = false,
	readonly = false,
	error = '',
	onChange,
	testid = '',
}) {
	return (
		<div className='label-input'>
			<strong>{label}</strong>{(required) && <span className='required-star'> *</span>}
			<div className={`input-with-validation ${error ? 'has-error' : ''}`}>
				<input
					type={type}
					placeholder={placeholder}
					className={`text-input-validation ${readonly ? 'readonly' : ''}`}
					value={value}
					readOnly={readonly}
					onChange={e => onChange(e.target.value)}
					data-testid={testid}
				/>
				{(error) && <span className='error-message'>{error}</span>}
			</div>
		</div>
	);
}

export default TextInputWithValidation;
