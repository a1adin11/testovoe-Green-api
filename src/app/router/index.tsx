import { createRootRoute, createRoute, createRouter, Outlet, redirect } from '@tanstack/react-router';

import { useSessionStore } from '@entities/session';
import { ChatPage } from '@pages/ChatPage';
import { LoginPage } from '@pages/LoginPage';

/**
 * Проверка доступов вне React.
 *
 * beforeLoad выполняется до рендера, поэтому хуки здесь недоступны —
 * читаем стор напрямую через getState.
 */
const hasCredentials = (): boolean => useSessionStore.getState().credentials !== null;

const rootRoute = createRootRoute({ component: Outlet });

/** Корень разводит пользователя по состоянию сессии */
const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/',
	beforeLoad: () => {
		throw redirect({ to: hasCredentials() ? '/chat' : '/login' });
	},
});

const loginRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/login',
	component: LoginPage,
	beforeLoad: () => {
		if (hasCredentials()) {
			throw redirect({ to: '/chat' });
		}
	},
});

const chatRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/chat',
	component: ChatPage,
	beforeLoad: () => {
		if (!hasCredentials()) {
			throw redirect({ to: '/login' });
		}
	},
});

const routeTree = rootRoute.addChildren([indexRoute, loginRoute, chatRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}

/**
 * Сброс сессии уводит на логин откуда угодно.
 *
 * beforeLoad срабатывает только при переходах, поэтому сам по себе он не
 * поможет: инстанс могли разлогинить, пока пользователь сидит на странице.
 * Подписка на стор закрывает этот разрыв, а решение «сессия недействительна»
 * остаётся в одном месте — тот, кто его принял, просто вызывает logout.
 */
useSessionStore.subscribe((state, previous) => {
	if (previous.credentials !== null && state.credentials === null) {
		void router.navigate({ to: '/login' });
	}
});
