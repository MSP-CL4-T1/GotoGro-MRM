import React from "react";
import Member from "./Member";
import { searchMembersByName, softDeleteMember, updateMember } from '../../Supabase/supabaseService';
import { MemoryRouter } from "react-router-dom";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from "react-dom/test-utils";
import MembersHome from "./MembersHome";

jest.mock('../../Supabase/supabaseService', () => ({
    softDeleteMember: jest.fn(),
    updateMember: jest.fn(),
    searchMembersByName: jest.fn(),
}));

beforeEach(async () => {
    const searchResults = [
        {
            member_id: 1,
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            date_joined: '2015-08-12'
        },
        {
            member_id: 2,
            first_name: 'Jane',
            last_name: 'Smith',
            email: 'jane.smith@example.com'
        }
    ];
    searchMembersByName.mockResolvedValue(searchResults);

    render(
        <MemoryRouter>
            <MembersHome />
        </MemoryRouter>
    );

    await act(async () => {
        const input = screen.getByPlaceholderText('Search members...');
        const searchButton = screen.getByText('Search');

        fireEvent.change(input, { target: { value: 'doe' } });
        fireEvent.click(searchButton);
    });

    await waitFor(() => {
        const viewButtons = screen.getAllByText(/View/i);
        const viewButton = viewButtons[0];

        fireEvent.click(viewButton);
    })
})

afterEach(() => {
    jest.clearAllMocks();
})

test('renders Member component', () => {
    render(<MemoryRouter><Member /></MemoryRouter>)
    const titleElement = screen.getByText(/Member Details/i);
    expect(titleElement).toBeInTheDocument();
    const firstNameValue = screen.getByText('John');
    expect(firstNameValue).toBeInTheDocument();
    const lastNameValue = screen.getByText('Doe');
    expect(lastNameValue).toBeInTheDocument();
    const emailValue = screen.getByText('john.doe@example.com');
    expect(emailValue).toBeInTheDocument();
    const dateJoinedValue = screen.getByText('2015-08-12');
    expect(dateJoinedValue).toBeInTheDocument();
    const editButton = screen.getByTestId('edit-button')
    expect(editButton).toBeInTheDocument();
    const deleteButton = screen.getByTestId('delete-button')
    expect(deleteButton).toBeInTheDocument();
})

test('edit member details', async () => {
    render(<MemoryRouter><Member /></MemoryRouter>)

    await act(async () => {
        const editButton = screen.getByTestId('edit-button')
        fireEvent.click(editButton);
    })

    await waitFor(() => {
        const firstNameInput = screen.getByTestId('first-name-input');
        fireEvent.change(firstNameInput, { target: { value: 'Jessie' } })
        const saveButton = screen.getByTestId('save-button')
        fireEvent.click(saveButton);
    })

    expect(updateMember).toHaveBeenCalledWith({
        member_id: 1,
        first_name: 'Jessie',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        date_joined: '2015-08-12'
    });
})

test('soft delete member', async () => {
    render(<MemoryRouter><Member /></MemoryRouter>)

    await act(async () => {
        const deleteButton = screen.getByTestId('delete-button')
        fireEvent.click(deleteButton);
    })

    expect(softDeleteMember).toHaveBeenCalledWith({
        member_id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        date_joined: '2015-08-12'
    });
})

