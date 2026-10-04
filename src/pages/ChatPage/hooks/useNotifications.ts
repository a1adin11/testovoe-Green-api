import { experimental_streamedQuery as streamedQuery, useQuery } from '@tanstack/react-query';

import { getCredentials, useCredentials, useSessionStore } from '@entities/session';
import { isSessionRejected } from '@shared/api';
import { AUTHORIZED_STATE } from '@shared/types';

import { deleteNotification } from '../api/deleteNotification';
import { receiveNotification } from '../api/receiveNotification';
import { toChatMessage } from '../lib/toChatMessage';
import { isMessageWebhook, isStateWebhook } from '../types';
import type { TChatMessage, TNotification } from '../types';
import { chatKeys } from './queryKeys';

const MAX_BUFFERED = 200;

const RETRY_DELAY = 3000;

/** Ожидание с учётом отмены */
const delay = (ms: number, signal: AbortSignal): Promise<void> =>
	new Promise(resolve => {
		const timer = setTimeout(resolve, ms);

		signal.addEventListener(
			'abort',
			() => {
				clearTimeout(timer);
				resolve();
			},
			{ once: true },
		);
	});

/** Подтверждение без пробрасывания ошибки. */
const acknowledge = async (receiptId: number): Promise<void> => {
	try {
		await deleteNotification(getCredentials(), receiptId);
	} catch {
		// намеренно игнорируем: повторная доставка безопасна
	}
};

/**
 * Бесконечный цикл long polling.
 */
async function* pollNotifications(signal: AbortSignal): AsyncGenerator<TChatMessage> {
	while (!signal.aborted) {
		let notification: TNotification | null;

		try {
			notification = await receiveNotification(getCredentials(), signal);
		} catch (error) {
			if (signal.aborted) {
				return;
			}

			if (isSessionRejected(error)) {
				useSessionStore.getState().logout();

				return;
			}

			await delay(RETRY_DELAY, signal);
			continue;
		}

		if (!notification) {
			continue;
		}

		const { body, receiptId } = notification;

		try {
			if (isMessageWebhook(body)) {
				yield toChatMessage(body);
			}
		} finally {
			await acknowledge(receiptId);
		}

		if (isStateWebhook(body) && body.stateInstance !== AUTHORIZED_STATE) {
			useSessionStore.getState().logout();

			return;
		}
	}
}

/**
 * Подписка на входящие сообщения инстанса.
 */
export const useNotifications = (): TChatMessage[] => {
	const idInstance = useCredentials()?.idInstance ?? '';

	const { data } = useQuery({
		queryKey: chatKeys.notifications(idInstance),
		queryFn: streamedQuery<TChatMessage, TChatMessage[]>({
			streamFn: ({ signal }) => pollNotifications(signal),
			refetchMode: 'append',
			reducer: (messages, message) => [...messages, message].slice(-MAX_BUFFERED),
			initialValue: [],
		}),
		enabled: Boolean(idInstance),
		staleTime: Infinity,
	});

	return data ?? [];
};
