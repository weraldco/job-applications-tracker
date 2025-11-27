// __test__/SignInPage.test.tsx
import SignInPage from '@/app/auth/signin/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

jest.mock('next-auth/react');
jest.mock('next/navigation', () => ({
	__esModule: true,
	useRouter: jest.fn(),
	useSearchParams: jest.fn(),
}));

// Mock Sonner toast
jest.mock('sonner', () => ({
	toast: {
		success: jest.fn(),
		error: jest.fn(),
	},
}));

describe('SignInPage', () => {
	const push = jest.fn();
	const refresh = jest.fn();

	beforeEach(() => {
		// Cast mocks
		const mockUseRouter = useRouter as jest.Mock;
		const mockUseSearchParams = useSearchParams as jest.Mock;

		// Mock router functions
		mockUseRouter.mockReturnValue({ push, refresh });

		// Mock search params
		mockUseSearchParams.mockReturnValue({
			get: jest.fn().mockReturnValue('/dashboard'),
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('renders the form correctly', () => {
		render(<SignInPage />);

		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: /sign in/i })
		).toBeInTheDocument();
	});

	it('calls signIn with correct values', async () => {
		(signIn as jest.Mock).mockResolvedValue({ ok: true, error: null });

		render(<SignInPage />);

		await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
		await userEvent.type(screen.getByLabelText(/password/i), 'password123');
		await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

		expect(signIn).toHaveBeenCalledWith('credentials', {
			email: 'test@example.com',
			password: 'password123',
			redirect: false,
			callbackUrl: '/dashboard',
		});

		expect(push).toHaveBeenCalledWith('/dashboard');
		expect(refresh).toHaveBeenCalled();
	});

	it('shows toast on error', async () => {
		(signIn as jest.Mock).mockRejectedValue(new Error('Network error'));

		render(<SignInPage />);

		await userEvent.type(screen.getByLabelText(/email/i), 'wrong@example.com');
		await userEvent.type(screen.getByLabelText(/password/i), 'wrongpass');
		await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

		expect(toast.error).toHaveBeenCalledWith(
			'Sign in failed',
			expect.objectContaining({
				description: 'Unexpected error while signing in',
			})
		);
	});
});
