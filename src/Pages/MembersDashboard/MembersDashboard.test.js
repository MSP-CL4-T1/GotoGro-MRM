import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { searchMembersByName, retrieveDeletedMember } from '../../Supabase/supabaseService';
import { MemoryRouter } from 'react-router-dom';
import MembersDashboard from './MembersDashboard';
import { act } from "react-dom/test-utils";
import Member from './Member';

jest.mock('../../Supabase/supabaseService', () => ({
    searchMembersByName: jest.fn(),
    retrieveDeletedMember: jest.fn(),
}));

afterEach(() => {
    jest.clearAllMocks();
});

test('renders MembersDashboard component', () => {
    render(
        <MemoryRouter>
            <MembersDashboard />
        </MemoryRouter>
    );
    const titleElement = screen.getByText(/Members Dashboard/i);
    expect(titleElement).toBeInTheDocument();
    const searchBar = screen.getByPlaceholderText('Search members...');
    expect(searchBar).toBeInTheDocument();
    const searchButton = screen.getByText('Search');
    expect(searchButton).toBeInTheDocument();
    const clearButton = screen.getByText('Clear');
    expect(clearButton).toBeInTheDocument();
    const addNewMemberButton = screen.getByText('Add New Member');
    expect(addNewMemberButton).toBeInTheDocument();
});

test('searches for members', async () => {
    const searchResults = [
        {
            member_id: 1,
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com'
        },
        {
            member_id: 2,
            first_name: 'Jane',
            last_name: 'Doe',
            email: 'jane.doe@example.com'
        }
    ];
    searchMembersByName.mockResolvedValue(searchResults);

    render(
        <MemoryRouter>
            <MembersDashboard />
        </MemoryRouter>
    );

    await act(async () => {
        const input = screen.getByPlaceholderText('Search members...');
        const searchButton = screen.getByText('Search');
        fireEvent.change(input, { target: { value: 'test' } });
        fireEvent.click(searchButton);
    })
    expect(searchMembersByName).toHaveBeenCalledWith('test');
});

test('isLoading is true after handleSearch', async () => {
    render(
        <MemoryRouter>
            <MembersDashboard />
        </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Search'));

    expect(screen.getByText('Loading...')).toBeInTheDocument();
});

test('saves selected member to local storage and navigates to the member page', async () => {
    const searchResults = [
        {
            member_id: 1,
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com'
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
            <MembersDashboard />
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

    render(
        <MemoryRouter>
            <Member />
        </MemoryRouter>
    );

    //assert that the selected person has been saved to local storage
    const firstNameValue = screen.getByText('John');
    expect(firstNameValue).toBeInTheDocument();
    const lastNameValue = screen.getByText('Doe');
    expect(lastNameValue).toBeInTheDocument();
    const emailValue = screen.getByText('john.doe@example.com');
    expect(emailValue).toBeInTheDocument();
});

test('retrieve recently deleted member (before 24 hours have passed)', async () => {
    const deletedMember = {
        member_id: 1,
        first_name: 'Deleted',
        last_name: 'Member',
        email: 'deleted.member@example.com',
        deleted: true,
        date_joined: "2023-09-01T00:00:00",
        time_deleted: "2023-10-04T00:00:00"
    };

    const searchResults = [
        {
            member_id: 2,
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
        },
        deletedMember,
    ];
    searchMembersByName.mockResolvedValue(searchResults);

    render(
        <MemoryRouter>
            <MembersDashboard />
        </MemoryRouter>
    );

    await act(async () => {
        // Search for members
        const input = screen.getByPlaceholderText('Search members...');
        const searchButton = screen.getByText('Search');
        fireEvent.change(input, { target: { value: 'test' } });
        fireEvent.click(searchButton);
    })

    await waitFor(() => {
        // Find the "Retrieve" button for the deleted member and click it
        const retrieveButtons = screen.getAllByText(/Retrieve/i);
        const retrieveButton = retrieveButtons[0];

        fireEvent.click(retrieveButton);
    })

    // Assert that retrieveDeletedMember was called with the correct member
    expect(retrieveDeletedMember).toHaveBeenCalledWith(deletedMember);
    // You can also assert that the selected member is saved to local storage
    const selectedMember = JSON.parse(localStorage.getItem('selectedMember'));
    expect(selectedMember).toEqual(deletedMember);
})
