import { ZodError } from 'zod';

/** Ошибка обращения к API */
export class ApiError extends Error {
	/** HTTP-статус ответа, 0 — ответа не было */
	readonly status: number;
	/** Тело ответа без чувствительных полей */
	readonly payload: unknown;
	/** Код ошибки axios: ECONNABORTED при таймауте, ERR_NETWORK при обрыве связи */
	readonly code?: string;

	constructor(message: string, status: number, payload?: unknown, code?: string) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		this.payload = payload;
		this.code = code;
	}
}

/** Коды axios, означающие, что ответа не дождались */
const TIMEOUT_CODES = ['ECONNABORTED', 'ETIMEDOUT'];

/**
 * Тело ошибки GREEN-API.
 */
interface IApiErrorBody {
	statusCode?: number;
	timestamp?: string;
	path?: string;
	message?: string;
}

const asErrorBody = (payload: unknown): IApiErrorBody | null =>
	typeof payload === 'object' && payload !== null ? (payload as IApiErrorBody) : null;

/**
 * Тело ошибки без чувствительных полей.
 */
export const sanitizeErrorPayload = (payload: unknown): unknown => {
	const body = asErrorBody(payload);

	if (!body || typeof body.path !== 'string') {
		return payload;
	}

	return { statusCode: body.statusCode, timestamp: body.timestamp, message: body.message };
};

/** Сообщения 400, означающие, что инстансом нельзя пользоваться */
const REJECTED_INSTANCE_HINTS = ['deleted', 'expired', 'not authorized', 'starting'];

/**
 * Запрос отклонён из-за доступов или состояния инстанса.
 */
export const isSessionRejected = (error: unknown): boolean => {
	if (!(error instanceof ApiError)) {
		return false;
	}

	if (error.status === 401 || error.status === 403) {
		return true;
	}

	if (error.status !== 400) {
		return false;
	}

	const text = (asErrorBody(error.payload)?.message ?? '').toLowerCase();

	return REJECTED_INSTANCE_HINTS.some(hint => text.includes(hint));
};

/**
 * Текст ошибки для пользователя.
 */
export const getApiErrorMessage = (error: unknown): string => {
	if (error instanceof ZodError) {
		return 'API вернул неожиданный ответ';
	}

	if (!(error instanceof ApiError)) {
		return 'Не удалось выполнить запрос';
	}

	switch (error.status) {
		case 0:
			return error.code !== undefined && TIMEOUT_CODES.includes(error.code)
				? 'API не ответил вовремя. Попробуйте ещё раз'
				: 'Нет связи с API. Проверьте соединение';
		case 400:
			return describeBadRequest(error);
		case 401:
			return 'Неверный apiTokenInstance';
		case 403:
			return 'Неверный idInstance или адрес API';
		case 429:
			return 'Слишком много запросов к API. Попробуйте позже';
		case 469:
			return 'Telegram ограничил поиск по номерам. Попробуйте позже';
		case 499:
		case 502:
			return 'API не ответил вовремя. Попробуйте ещё раз';
		default:
			return error.status >= 500 ? 'Ошибка на стороне API' : 'Запрос отклонён API';
	}
};

const describeBadRequest = (error: ApiError): string => {
	const text = (asErrorBody(error.payload)?.message ?? '').toLowerCase();

	if (text.includes('deleted')) {
		return 'Инстанс удалён';
	}
	if (text.includes('expired')) {
		return 'Срок действия инстанса истёк';
	}
	if (text.includes('not authorized') || text.includes('starting')) {
		return 'Инстанс не авторизован или ещё запускается';
	}

	return 'API отклонил запрос: проверьте параметры';
};
