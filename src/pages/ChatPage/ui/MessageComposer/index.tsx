import { useState } from 'react';
import type { FormEvent, ReactElement } from 'react';

import { getApiErrorMessage } from '@shared/api';
import { Button } from '@shared/ui/Button';

import { MESSAGE_MAX_LENGTH } from '../../api/sendMessage';
import { useSendMessage } from '../../hooks/useSendMessage';
import styles from './MessageComposer.module.scss';

interface IProps {
	chatId: string;
}

/** Поле отправки сообщения */
export const MessageComposer = ({ chatId }: IProps): ReactElement => {
	const [text, setText] = useState('');
	const { mutate, isPending, error } = useSendMessage(chatId);

	const trimmed = text.trim();

	/** Обработчик отправки */
	const handleSubmit = (event: FormEvent): void => {
		event.preventDefault();

		if (trimmed === '') {
			return;
		}

		mutate(trimmed, { onSuccess: () => setText('') });
	};

	return (
		<form className={styles.composer} onSubmit={handleSubmit}>
			<textarea
				className={styles.field}
				value={text}
				onChange={event => setText(event.target.value)}
				placeholder="Сообщение"
				rows={2}
				maxLength={MESSAGE_MAX_LENGTH}
			/>

			<Button type="submit" isLoading={isPending} disabled={trimmed === ''}>
				Отправить
			</Button>

			{error && <p className={styles.error}>{getApiErrorMessage(error)}</p>}
		</form>
	);
};
