import type { IApiCredentials } from '@shared/types';

/**
 * Путь до метода GREEN-API.
 */
export const buildPath = ({ idInstance, apiTokenInstance }: IApiCredentials, method: string): string =>
	`/waInstance${idInstance}/${method}/${apiTokenInstance}`;
