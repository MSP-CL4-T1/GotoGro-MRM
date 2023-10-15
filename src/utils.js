export function validateInput(value, required, regex = '', regexErrorMsg = '') {
	if (required && value === '') {
		return 'Required';
	}

	if (regex && !regex.test(value)) {
		return regexErrorMsg;
	}

	return '';
}
