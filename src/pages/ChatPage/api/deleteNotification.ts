import { api, buildPath } from '@shared/api';
import type { IApiCredentials } from '@shared/types';

import type { IDeleteNotificationResponse } from '../types';

/** Подтверждение обработки уведомления. */
export const deleteNotification = async (credentials: IApiCredentials, receiptId: number): Promise<boolean> => {
	const { data } = await api.delete<IDeleteNotificationResponse>(
		`${buildPath(credentials, 'deleteNotification')}/${receiptId}`,
	);

	return data.result;
};
