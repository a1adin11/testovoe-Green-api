import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';

import { getCredentials, useCredentials } from '@entities/session';

import { getChatHistory } from '../api/getChatHistory';
import type { TChatMessage } from '../types';
import { chatKeys } from './queryKeys';

/** История сообщений чата */
export const useChatHistory = (chatId: string | null): UseQueryResult<TChatMessage[], Error> => {
	const credentials = useCredentials();
	const idInstance = credentials?.idInstance ?? '';

	return useQuery({
		queryKey: chatKeys.history(idInstance, chatId ?? ''),
		queryFn: ({ signal }) => getChatHistory(getCredentials(), chatId ?? '', undefined, signal),
		enabled: Boolean(chatId) && Boolean(credentials),
		staleTime: Infinity,
		refetchOnReconnect: false,
	});
};
