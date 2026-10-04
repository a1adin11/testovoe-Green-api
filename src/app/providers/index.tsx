import { useState } from 'react';
import type { PropsWithChildren, ReactElement } from 'react';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useSessionStore } from '@entities/session';
import { isSessionRejected } from '@shared/api';

/** Сколько раз повторяем неудачный запрос */
const RETRY_COUNT = 1;

/**
 * Любой отклонённый сессией запрос сбрасывает доступы.
 *
 * Сам редирект живёт в app/router: он подписан на стор, поэтому достаточно
 * очистить сессию в одном месте, откуда бы ошибка ни пришла.
 */
const handleError = (error: Error): void => {
	if (isSessionRejected(error)) {
		useSessionStore.getState().logout();
	}
};

/** Повторять нет смысла, если дело в доступах, а не в связи */
const shouldRetry = (failureCount: number, error: Error): boolean =>
	!isSessionRejected(error) && failureCount < RETRY_COUNT;

/** Провайдеры приложения */
export const AppProviders = ({ children }: PropsWithChildren): ReactElement => {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				queryCache: new QueryCache({ onError: handleError }),
				mutationCache: new MutationCache({ onError: handleError }),
				defaultOptions: {
					queries: {
						retry: shouldRetry,
						staleTime: 30_000,
						refetchOnWindowFocus: false,
					},
					mutations: {
						retry: shouldRetry,
					},
				},
			}),
	);

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
