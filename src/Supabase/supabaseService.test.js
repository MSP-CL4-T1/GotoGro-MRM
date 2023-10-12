import {
	signOut,
	signUp,
} from './supabaseService'; // Import the functions to test
import supabase from './supabaseClient'; // Import the supabaseClient

// Mock supabaseClient
jest.mock('./supabaseClient', () => {
	const mockFrom = jest.fn();
	const mockSelect = jest.fn().mockReturnThis();
	const mockOr = jest.fn().mockReturnThis();

	return {
		auth: {
			signOut: jest.fn(),
			signUp: jest.fn(),
			signInWithPassword: jest.fn(),
		},
		from: mockFrom.mockImplementation(() => ({
			select: mockSelect,
			or: mockOr,
		})),
	};
});

describe('supabaseService', () => {
	afterEach(() => {
		jest.clearAllMocks(); // Clear mock function calls after each test
	});

	describe('signOut', () => {
		it('should call supabase.auth.signOut', async () => {
			await signOut();
			expect(supabase.auth.signOut).toHaveBeenCalled();
		});
	});

	describe('signUp', () => {
		it('should sign up a new user', async () => {
			// Mock successful sign-up
			const email = 'test@example.com';
			const password = 'password';
			const mockUser = {id: 1, email};
			supabase.auth.signUp.mockResolvedValue({user: mockUser, error: null});

			const result = await signUp(email, password);

			expect(result).toEqual(mockUser);
			expect(supabase.auth.signUp).toHaveBeenCalledWith({email, password});
		});

		it('should throw an error if sign up fails', async () => {
			// Mock sign-up error
			const email = 'test@example.com';
			const password = 'password';
			const mockError = new Error('Sign up failed');
			supabase.auth.signUp.mockResolvedValue({user: null, error: mockError});

			await expect(signUp(email, password)).rejects.toThrow(mockError);
			expect(supabase.auth.signUp).toHaveBeenCalledWith({email, password});
		});
	});
});
