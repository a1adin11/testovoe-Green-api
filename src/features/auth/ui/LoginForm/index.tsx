import type { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@shared/ui/Button';
import { Input } from '@shared/ui/Input';

import { loginSchema } from '../../model/schema';
import type { TLoginFormValues } from '../../model/schema';
import { useLogin } from './hooks/useLogin';
import styles from './LoginForm.module.scss';

/**
 * @desc Пропсы формы входа
 *
 * @prop {Function} onSuccess - Коллбэк после сохранения доступов
 */
interface IProps {
	onSuccess?: () => void;
}

export const LoginForm = ({ onSuccess }: IProps): ReactElement => {
	const { mutate, isPending, errorMessage } = useLogin({ onSuccess });

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TLoginFormValues>({
		resolver: zodResolver(loginSchema),
		mode: 'onTouched',
		defaultValues: {
			idInstance: '',
			apiTokenInstance: '',
		},
	});

	const onSubmit = (values: TLoginFormValues): void => {
		mutate(values);
	};

	return (
		<form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
			<h1 className={styles.title}>Вход</h1>
			<p className={styles.hint}>Доступы инстанса из личного кабинета GREEN-API</p>

			<Input
				label="idInstance"
				placeholder="1101234567"
				autoComplete="username"
				required
				error={errors.idInstance?.message}
				{...register('idInstance')}
			/>

			<Input
				type="password"
				label="apiTokenInstance"
				placeholder="Введите токен"
				autoComplete="current-password"
				required
				error={errors.apiTokenInstance?.message}
				{...register('apiTokenInstance')}
			/>

			{errorMessage && <p className={styles.error}>{errorMessage}</p>}

			<Button type="submit" fullWidth isLoading={isPending}>
				Войти
			</Button>
		</form>
	);
};
