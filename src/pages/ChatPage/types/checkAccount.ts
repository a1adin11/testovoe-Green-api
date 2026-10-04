import { z } from 'zod';

/**
 * Схема оставлена: exist и chatId управляют навигацией, и если поле
 * пропадёт из ответа, undefined молча прочитается как «аккаунта нет».
 */
export const checkAccountSchema = z.object({
	exist: z.boolean(),
	chatId: z.string(),
	username: z.string().nullish(),
	phoneNumber: z.union([z.string(), z.number()]).nullish(),
	fromCache: z.boolean().nullish(),
});

/** Результат проверки аккаунта */
export type TCheckAccountResult = z.infer<typeof checkAccountSchema>;
