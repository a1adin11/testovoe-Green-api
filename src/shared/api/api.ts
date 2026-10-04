import axios from 'axios';
import { AxiosError, CanceledError } from 'axios';

import { API_URL } from '@shared/config';

import { ApiError, sanitizeErrorPayload } from './errors';

/**
 * Таймаут по умолчанию.
 */
export const DEFAULT_TIMEOUT = 30 * 1000;

/**
 * Инстанс axios для GREEN-API.
 */
export const api = axios.create({
	baseURL: API_URL,
	timeout: DEFAULT_TIMEOUT,
});

api.interceptors.response.use(
	response => response,
	(error: unknown) => {
		if (error instanceof CanceledError) {
			return Promise.reject(error);
		}

		if (error instanceof AxiosError) {
			const status = error.response?.status ?? 0;

			const payload = sanitizeErrorPayload(error.response?.data);

			return Promise.reject(new ApiError(error.message, status, payload, error.code));
		}

		return Promise.reject(new ApiError('Неизвестная ошибка запроса', 0, error));
	},
);
