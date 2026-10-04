import type { TChatMessage } from '../types';

/**
 * Слияние сообщений из истории и из очереди уведомлений.
 *
 * Ключ — idMessage, и это обязательно: очередь гарантирует доставку
 * «хотя бы один раз», так что при недошедшем подтверждении одно и то же
 * уведомление придёт повторно. Запись по ключу делает слияние идемпотентным,
 * а «последний побеждает» заодно даёт нужное поведение для правок сообщений.
 *
 * Сортировка приводит оба источника к одному порядку: история отдаёт
 * сообщения от новых к старым, уведомления приходят от старых к новым.
 */
export const mergeMessages = (...sources: readonly TChatMessage[][]): TChatMessage[] => {
	const byId = new Map<string, TChatMessage>();

	for (const source of sources) {
		for (const message of source) {
			byId.set(message.idMessage, message);
		}
	}

	return [...byId.values()].sort((a, b) => a.timestamp - b.timestamp);
};
