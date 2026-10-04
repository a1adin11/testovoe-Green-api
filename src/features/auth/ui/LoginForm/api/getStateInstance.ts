import { api, buildPath } from '@shared/api';
import type { IApiCredentials, TInstanceState } from '@shared/types';

import type { IStateInstanceResponse } from '../types';

/**
 * Состояние инстанса.
 *
 * неверный apiTokenInstance: 401,
 * неверный idInstance: 403, удалённый или просроченный инстанс: 400.
 */
export const getStateInstance = async (
	credentials: IApiCredentials,
	signal?: AbortSignal,
): Promise<TInstanceState> => {
	const { data } = await api.get<IStateInstanceResponse>(buildPath(credentials, 'getStateInstance'), { signal });

	return data.stateInstance;
};
