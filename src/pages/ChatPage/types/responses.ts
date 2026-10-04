/** Ответ sendMessage */
export interface ISendMessageResponse {
	idMessage: string;
}

/** Ответ deleteNotification. */
export interface IDeleteNotificationResponse {
	result: boolean;
	reason?: string;
}
