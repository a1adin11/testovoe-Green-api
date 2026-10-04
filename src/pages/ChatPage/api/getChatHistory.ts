import { api, buildPath } from '@shared/api';
import type { IApiCredentials } from '@shared/types';

import { chatHistorySchema } from '../types';
import type { TChatMessage } from '../types';

/** Количество сообщений по умолчанию */
const DEFAULT_COUNT = 100;

/** История сообщений чата. */
export const getChatHistory = async (
	credentials: IApiCredentials,
	chatId: string,
	count: number = DEFAULT_COUNT,
	signal?: AbortSignal,
): Promise<TChatMessage[]> => {
	const { data } = await api.post<TChatMessage>(buildPath(credentials, 'getChatHistory'), { chatId, count }, { signal });

	return chatHistorySchema.parse(data);
};
