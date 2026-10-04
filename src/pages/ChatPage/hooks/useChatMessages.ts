import type { TChatMessage } from '../types';
import { mergeMessages } from '../lib/mergeMessages';
import { useChatHistory } from './useChatHistory';
import { useNotifications } from './useNotifications';

interface IChatMessages {
	/** Сообщения чата от старых к новым */
	messages: TChatMessage[];
	/** Грузится история */
	isLoading: boolean;
	error: Error | null;
}

/** Сообщения открытого чата. */
export const useChatMessages = (chatId: string | null): IChatMessages => {
	const history = useChatHistory(chatId);
	const notifications = useNotifications();

	const live = notifications.filter(message => message.chatId === chatId);

	return {
		messages: mergeMessages(history.data ?? [], live),
		isLoading: history.isLoading,
		error: history.error,
	};
};
