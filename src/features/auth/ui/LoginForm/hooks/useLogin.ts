import { useMutation } from '@tanstack/react-query';
import type { UseMutationResult } from '@tanstack/react-query';

import { useSessionStore } from '@entities/session';
import type { ICredentials } from '@entities/session';
import { getApiErrorMessage, getInstanceStateMessage } from '@shared/api';
import { AUTHORIZED_STATE } from '@shared/types';
import type { TInstanceState } from '@shared/types';

import { getStateInstance } from '../api/getStateInstance';

interface IOptions {
	onSuccess?: () => void;
}

type TLoginResult = UseMutationResult<TInstanceState, Error, ICredentials> & {
	errorMessage: string | null;
};

export const useLogin = ({ onSuccess }: IOptions = {}): TLoginResult => {
	const login = useSessionStore(state => state.login);

	const mutation = useMutation<TInstanceState, Error, ICredentials>({
		mutationFn: credentials => getStateInstance(credentials),
		onSuccess: (state, credentials) => {
			if (state !== AUTHORIZED_STATE) {
				return;
			}

			login(credentials);
			onSuccess?.();
		},
	});

	return {
		...mutation,
		errorMessage: toErrorMessage(mutation),
	};
};

const toErrorMessage = ({
	error,
	data,
	isPending,
}: Pick<UseMutationResult<TInstanceState, Error, ICredentials>, 'error' | 'data' | 'isPending'>): string | null => {
	if (isPending) {
		return null;
	}

	if (error) {
		return getApiErrorMessage(error);
	}

	return data !== undefined && data !== AUTHORIZED_STATE ? getInstanceStateMessage(data) : null;
};
