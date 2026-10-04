import { api, buildPath } from '@shared/api';
import type { IApiCredentials } from '@shared/types';

import type { ISendMessageResponse } from '../types';

export const MESSAGE_MAX_LENGTH = 4096;

/** Отправка текстового сообщения. */
export const sendMessage = async (
	credentials: IApiCredentials,
	chatId: string,
	message: string,
	signal?: AbortSignal,
): Promise<string> => {
	const { data } = await api.post<ISendMessageResponse>(
		buildPath(credentials, 'sendMessage'),
		{ chatId, message },
		{ signal },
	);

	return data.idMessage;
};
