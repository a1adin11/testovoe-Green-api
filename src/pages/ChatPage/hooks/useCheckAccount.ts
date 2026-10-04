import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseMutationResult } from '@tanstack/react-query';

import { getCredentials, useCredentials } from '@entities/session';

import { checkAccount } from '../api/checkAccount';
import type { TCheckAccountResult } from '../types';
import { chatKeys } from './queryKeys';

/** Сколько результат проверки номера считается свежим */
const ACCOUNT_STALE_TIME = 5 * 60 * 1000;

/**
 * Проверка номера с кэшем по самому номеру.
 */
export const useCheckAccount = (): UseMutationResult<TCheckAccountResult, Error, string> => {
	const idInstance = useCredentials()?.idInstance ?? '';
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (phoneNumber: string) =>
			queryClient.fetchQuery({
				queryKey: chatKeys.account(idInstance, phoneNumber),
				queryFn: ({ signal }) => checkAccount(getCredentials(), phoneNumber, signal),
				staleTime: ACCOUNT_STALE_TIME,
			}),
	});
};
