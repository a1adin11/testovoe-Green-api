import type { ReactElement } from 'react';
import { RouterProvider } from '@tanstack/react-router';

import { AppProviders } from './providers';
import { router } from './router';
import './styles/global.css';

/** Корневой компонент приложения */
export const App = (): ReactElement => (
	<AppProviders>
		<RouterProvider router={router} />
	</AppProviders>
);
