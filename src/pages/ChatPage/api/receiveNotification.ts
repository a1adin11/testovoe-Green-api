import { api, buildPath } from '@shared/api';
import type { IApiCredentials } from '@shared/types';

import { notificationSchema } from '../types';
import type { TNotification } from '../types';

/** Сколько секунд сервер держит запрос, ожидая событие (допустимо 5–60) */
export const RECEIVE_TIMEOUT_SECONDS = 20;

/** Запас к таймауту запроса поверх серверного ожидания */
const TIMEOUT_MARGIN = 5000;

/** Получение одного уведомления из очереди (long polling). */
export const receiveNotification = async (
	credentials: IApiCredentials,
	signal?: AbortSignal,
): Promise<TNotification | null> => {
	const { data } = await api.get<unknown>(buildPath(credentials, 'receiveNotification'), {
		params: { receiveTimeout: RECEIVE_TIMEOUT_SECONDS },
		timeout: RECEIVE_TIMEOUT_SECONDS * 1000 + TIMEOUT_MARGIN,
		signal,
	});

	if (data === '' || data === null || data === undefined) {
		return null;
	}

	return notificationSchema.parse(data);
};
