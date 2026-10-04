import { api, buildPath } from '@shared/api';
import type { IApiCredentials } from '@shared/types';

import { checkAccountSchema } from '../types';
import type { TCheckAccountResult } from '../types';

/** Проверка наличия аккаунта Telegram по номеру. */
export const checkAccount = async (
	credentials: IApiCredentials,
	phoneNumber: string,
	signal?: AbortSignal,
): Promise<TCheckAccountResult> => {
	const { data } = await api.post<TCheckAccountResult>(
		buildPath(credentials, 'checkAccount'),
		{ phoneNumber: Number(phoneNumber) },
		{ signal },
	);

	return checkAccountSchema.parse(data);
};
