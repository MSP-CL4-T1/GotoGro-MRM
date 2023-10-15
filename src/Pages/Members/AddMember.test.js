import React from 'react';
import AddMember from './AddMember';
import {addMember} from '../../Supabase/supabaseService';
import {MemoryRouter} from 'react-router-dom';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {act} from 'react-dom/test-utils';

jest.mock('../../Supabase/supabaseService', () => ({
	addMember: jest.fn(),
}));

afterEach(() => {
	jest.clearAllMocks();
});

test('renders AddMember component', () => {
	render(<MemoryRouter><AddMember /></MemoryRouter>);
	const titleElement = screen.getAllByText(/Add Member/i)[0];
	expect(titleElement).toBeInTheDocument();
	const firstNameInput = screen.getByTestId('first-name-input');
	expect(firstNameInput).toBeInTheDocument();
	const lastNameInput = screen.getByTestId('last-name-input');
	expect(lastNameInput).toBeInTheDocument();
	const emailInput = screen.getByTestId('email-input');
	expect(emailInput).toBeInTheDocument();
	const dateJoinedInput = screen.getByTestId('date-joined-input');
	expect(dateJoinedInput).toBeInTheDocument();
	const addMemberButton = screen.getByTestId('add-button');
	expect(addMemberButton).toBeInTheDocument();
	const cancelButton = screen.getByTestId('cancel-button');
	expect(cancelButton).toBeInTheDocument();
});

test('adds a member', async () => {
	render(<MemoryRouter><AddMember /></MemoryRouter>);

	await act(async () => {
		const firstNameInput = screen.getByTestId('first-name-input');
		fireEvent.change(firstNameInput, {target: {value: 'Marella'}});
		const lastNameInput = screen.getByTestId('last-name-input');
		fireEvent.change(lastNameInput, {target: {value: 'Morad'}});
		const emailInput = screen.getByTestId('email-input');
		fireEvent.change(emailInput, {target: {value: 'marellam@gmail.com'}});
		const dateJoinedInput = screen.getByTestId('date-joined-input');
		fireEvent.change(dateJoinedInput, {target: {value: '2023-10-05'}});
		const addMemberButton = screen.getByTestId('add-button');
		fireEvent.click(addMemberButton);
	});
});

test('fails to add a member if required field is missing a value', async () => {
	render(<MemoryRouter><AddMember /></MemoryRouter>);

	await act(async () => {
		const firstNameInput = screen.getByTestId('first-name-input');
		fireEvent.change(firstNameInput, {target: {value: 'Marella'}});
		const lastNameInput = screen.getByTestId('last-name-input');
		fireEvent.change(lastNameInput, {target: {value: 'Morad'}});
		const dateJoinedInput = screen.getByTestId('date-joined-input');
		fireEvent.change(dateJoinedInput, {target: {value: '2023-10-05'}});
		const addMemberButton = screen.getByTestId('add-button');
		fireEvent.click(addMemberButton);
	});

	expect(addMember).not.toHaveBeenCalled();
});
