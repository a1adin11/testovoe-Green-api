/** Состояния инстанса из документации GREEN-API */
export const INSTANCE_STATES = [
	'authorized',
	'notAuthorized',
	'blocked',
	'suspended',
	'starting',
	'pendingPassword',
] as const;

/** Состояние инстанса */
export type TInstanceState = (typeof INSTANCE_STATES)[number];

/** Единственное состояние, в котором инстансом можно пользоваться */
export const AUTHORIZED_STATE: TInstanceState = 'authorized';
