import type { TChatMessage, TMessageWebhook } from '../types';

/**
 * Уведомление в тот же вид, в котором приходит история.
 *
 * Формы различаются: в истории текст лежит плоским полем textMessage, а в
 * уведомлении — вложенным в messageData. Приводим к виду истории, чтобы
 * список сообщений не знал, из какого источника пришла запись.
 */
export const toChatMessage = (webhook: TMessageWebhook): TChatMessage => {
	const { messageData, senderData } = webhook;
	const text = messageData.textMessageData?.textMessage ?? messageData.extendedTextMessageData?.text;

	const base = {
		idMessage: webhook.idMessage,
		type: webhook.typeWebhook === 'incomingMessageReceived' ? ('incoming' as const) : ('outgoing' as const),
		timestamp: webhook.timestamp,
		chatId: senderData.chatId,
		senderId: senderData.sender,
		senderName: senderData.senderName,
		senderContactName: senderData.senderContactName,
	};

	if (messageData.typeMessage === 'textMessage' && text !== undefined) {
		return { ...base, typeMessage: 'textMessage', textMessage: text };
	}

	return {
		...base,
		typeMessage: messageData.typeMessage,
		textMessage: text,
		caption: messageData.fileMessageData?.caption,
		downloadUrl: messageData.fileMessageData?.downloadUrl,
		fileName: messageData.fileMessageData?.fileName,
	};
};
