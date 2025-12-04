// __mocks__/next-auth/react.ts
export const signIn = jest.fn();
export const signOut = jest.fn();
export const useSession = jest.fn(() => ({
	data: null,
	status: 'unauthenticated',
}));
