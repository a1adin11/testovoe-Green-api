import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ICredentials {
	idInstance: string;
	apiTokenInstance: string;
}

interface SessionState {
	credentials: ICredentials | null;
	login: (credentials: ICredentials) => void;
	logout: () => void;
}

export const useSessionStore = create<SessionState>()(
	persist(
		set => ({
			credentials: null,
			login: credentials => set({ credentials }),
			logout: () => set({ credentials: null }),
		}),
		{
			name: 'green-api-session',
			partialize: state => ({ credentials: state.credentials }),
		},
	),
);

export const getCredentials = (): ICredentials => {
	const { credentials } = useSessionStore.getState();

	if (!credentials) {
		throw new Error('Нет доступов инстанса');
	}

	return credentials;
};

export const useCredentials = (): ICredentials | null => useSessionStore(state => state.credentials);

export const useIsAuthorized = (): boolean => useSessionStore(state => state.credentials !== null);
