import type { TInstanceState } from '@shared/types';

const STATE_MESSAGES: Record<TInstanceState, string> = {
	authorized: 'Инстанс готов к работе',
	notAuthorized: 'Инстанс не авторизован — войдите в аккаунт в консоли GREEN-API',
	blocked: 'Инстанс заблокирован',
	suspended: 'На инстансе временные ограничения отправки',
	starting: 'Инстанс запускается, это занимает до 5 минут',
	pendingPassword: 'Инстанс ждёт пароль двухфакторной аутентификации',
};

/**
 * Описание состояния для пользователя.
 */
export const getInstanceStateMessage = (state: TInstanceState): string =>
	STATE_MESSAGES[state] ?? `Инстанс в состоянии «${state}»`;
