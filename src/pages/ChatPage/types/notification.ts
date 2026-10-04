import { z } from 'zod';

/** Типы уведомлений, которые несут сообщение */
const MESSAGE_WEBHOOKS = ['incomingMessageReceived', 'outgoingMessageReceived', 'outgoingAPIMessageReceived'] as const;

const senderDataSchema = z.object({
	chatId: z.string(),
	sender: z.string().nullish(),
	chatName: z.string().nullish(),
	senderName: z.string().nullish(),
	senderContactName: z.string().nullish(),
});

/**
 * Текст лежит в двух разных местах: у простого сообщения в textMessageData,
 * у цитаты и пересылки — в extendedTextMessageData.text. Поля jpegThumbnail
 * в схеме нет намеренно: это base64 превью на десятки килобайт, которое
 * zod отбросит и не потащит в кэш.
 */
const messageDataSchema = z.object({
	typeMessage: z.string(),
	textMessageData: z.object({ textMessage: z.string() }).nullish(),
	extendedTextMessageData: z.object({ text: z.string() }).nullish(),
	fileMessageData: z
		.object({
			downloadUrl: z.string().nullish(),
			caption: z.string().nullish(),
			fileName: z.string().nullish(),
		})
		.nullish(),
});

const messageWebhookSchema = z.object({
	typeWebhook: z.enum(MESSAGE_WEBHOOKS),
	timestamp: z.number(),
	idMessage: z.string(),
	senderData: senderDataSchema,
	messageData: messageDataSchema,
});

/**
 * Смена состояния инстанса.
 *
 * Приходит, когда инстанс разлогинили, заблокировали или он перезапускается.
 * Это единственный способ узнать об этом сразу, не дожидаясь первого
 * отклонённого запроса.
 */
const stateWebhookSchema = z.object({
	typeWebhook: z.literal('stateInstanceChanged'),
	timestamp: z.number(),
	stateInstance: z.string(),
});

/**
 * Остальные типы — статусы доставки, превышение квоты. Их надо подтверждать
 * наравне с сообщениями, поэтому разбираем нестрого: уронить цикл на
 * незнакомом типе нельзя.
 */
const otherWebhookSchema = z.object({
	typeWebhook: z.string(),
});

/** Схема ответа receiveNotification */
export const notificationSchema = z.object({
	receiptId: z.number(),
	body: z.union([messageWebhookSchema, stateWebhookSchema, otherWebhookSchema]),
});

/** Уведомление из очереди */
export type TNotification = z.infer<typeof notificationSchema>;

/** Уведомление с сообщением */
export type TMessageWebhook = z.infer<typeof messageWebhookSchema>;

/** Уведомление о смене состояния инстанса */
export type TStateWebhook = z.infer<typeof stateWebhookSchema>;

/** Несёт ли уведомление сообщение */
export const isMessageWebhook = (body: TNotification['body']): body is TMessageWebhook =>
	(MESSAGE_WEBHOOKS as readonly string[]).includes(body.typeWebhook);

/** Сообщает ли уведомление о смене состояния инстанса */
export const isStateWebhook = (body: TNotification['body']): body is TStateWebhook =>
	body.typeWebhook === 'stateInstanceChanged';
