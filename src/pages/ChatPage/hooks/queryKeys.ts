/** Ключи кэша чатов. */
export const chatKeys = {
	root: (idInstance: string) => ['chat', idInstance] as const,
	account: (idInstance: string, phoneNumber: string) => ['chat', idInstance, 'account', phoneNumber] as const,
	history: (idInstance: string, chatId: string) => ['chat', idInstance, 'history', chatId] as const,
	notifications: (idInstance: string) => ['chat', idInstance, 'notifications'] as const,
};
