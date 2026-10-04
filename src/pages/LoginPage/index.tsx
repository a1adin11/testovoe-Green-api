import type { ReactElement } from 'react';
import { useNavigate } from '@tanstack/react-router';

import { LoginForm } from '@features/auth';

import styles from './LoginPage.module.scss';

export const LoginPage = (): ReactElement => {
	const navigate = useNavigate();

	return (
		<div className={styles.wrapper}>
			<LoginForm onSuccess={() => void navigate({ to: '/chat' })} />
		</div>
	);
};
