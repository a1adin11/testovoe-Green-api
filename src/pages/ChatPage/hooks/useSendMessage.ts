import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseMutationResult } from '@tanstack/react-query';

import { getCredentials, useCredentials } from '@entities/session';

import { sendMessage } from '../api/sendMessage';
import { chatKeys } from './queryKeys';

/** Отправка сообщения.*/
export const useSendMessage = (chatId: string): UseMutationResult<string, Error, string> => {
	const idInstance = useCredentials()?.idInstance ?? '';
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (message: string) => sendMessage(getCredentials(), chatId, message),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: chatKeys.history(idInstance, chatId) }),
	});
};
