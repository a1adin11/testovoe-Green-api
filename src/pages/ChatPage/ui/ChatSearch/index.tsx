import type { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { getApiErrorMessage } from '@shared/api';
import { Button } from '@shared/ui/Button';
import { Input } from '@shared/ui/Input';

import { useCheckAccount } from '../../hooks/useCheckAccount';
import styles from './ChatSearch.module.scss';

const searchSchema = z.object({
	phoneNumber: z
		.string()
		.trim()
		.min(11, 'Номер от 11 до 16 цифр')
		.max(16, 'Номер от 11 до 16 цифр')
		.regex(/^\d+$/, 'Только цифры, без плюса и пробелов'),
});

type TSearchValues = z.infer<typeof searchSchema>;

interface IProps {
	onFound: (chatId: string) => void;
}

/** Поиск диалога по номеру телефона */
export const ChatSearch = ({ onFound }: IProps): ReactElement => {
	const { mutate, isPending, error, data } = useCheckAccount();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TSearchValues>({
		resolver: zodResolver(searchSchema),
		mode: 'onTouched',
		defaultValues: { phoneNumber: '' },
	});

	/** Обработчик поиска */
	const onSubmit = ({ phoneNumber }: TSearchValues): void => {
		mutate(phoneNumber, {
			onSuccess: result => {
				if (result.exist) {
					onFound(result.chatId);
				}
			},
		});
	};

	const notFound = data !== undefined && !data.exist;

	return (
		<form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
			<Input
				type="search"
				label="Номер телефона"
				placeholder="79001234567"
				inputMode="numeric"
				error={errors.phoneNumber?.message}
				{...register('phoneNumber')}
			/>

			<Button type="submit" isLoading={isPending}>
				Найти
			</Button>

			{error && <p className={styles.error}>{getApiErrorMessage(error)}</p>}
			{notFound && <p className={styles.error}>Аккаунт не найден или скрыт настройками приватности</p>}
		</form>
	);
};
