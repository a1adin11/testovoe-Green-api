import { z } from 'zod';

/** Поля, которые есть в сообщении любого типа */
const baseMessageShape = {
	idMessage: z.string(),
	type: z.enum(['incoming', 'outgoing']),
	timestamp: z.number(),
	chatId: z.string().nullish(),
	senderId: z.string().nullish(),
	senderName: z.string().nullish(),
	senderContactName: z.string().nullish(),
	statusMessage: z.string().nullish(),
};

/**
 * Текстовое сообщение.
 *
 * textMessage здесь обязателен — это и есть смысл разделения по типам:
 * пока поле лежало рядом с остальными как nullish, его исчезновение или
 * переименование схема пропускала, и undefined всплывал уже в разметке.
 */
const textMessageSchema = z.object({
	...baseMessageShape,
	typeMessage: z.literal('textMessage'),
	textMessage: z.string(),
});

/**
 * Любой другой тип сообщения.
 *
 * Ветка намеренно нестрогая и идёт второй: типов в документации семь, но
 * список может пополниться, и незнакомое значение не должно ронять разбор
 * всей истории. Текст до этой ветки не доходит — его забирает первая.
 */
const otherMessageSchema = z.object({
	...baseMessageShape,
	typeMessage: z.string(),
	// Текст есть и у нетекстовых типов: подпись к файлу, текст цитаты
	textMessage: z.string().nullish(),
	caption: z.string().nullish(),
	downloadUrl: z.string().nullish(),
	fileName: z.string().nullish(),
});

const chatMessageSchema = z.union([textMessageSchema, otherMessageSchema]);

/** Схема ответа getChatHistory */
export const chatHistorySchema = z.array(chatMessageSchema);

/** Сообщение в истории чата */
export type TChatMessage = z.infer<typeof chatMessageSchema>;

/** Текстовое сообщение */
export type TTextChatMessage = z.infer<typeof textMessageSchema>;

/** Сужение по типу сообщения для разметки */
export const isTextMessage = (message: TChatMessage): message is TTextChatMessage =>
	message.typeMessage === 'textMessage';
