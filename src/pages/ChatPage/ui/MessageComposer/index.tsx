import { useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent, ReactElement } from 'react';

import { getApiErrorMessage } from '@shared/api';
import { Button } from '@shared/ui/Button';

import { MESSAGE_MAX_LENGTH } from '../../api/sendMessage';
import { useSendMessage } from '../../hooks/useSendMessage';
import styles from './MessageComposer.module.scss';

interface IProps {
	chatId: string;
}

/** Высота в одну строку совпадает с высотой кнопки */
const SINGLE_ROW_HEIGHT = 42;

/** До какой высоты растём, прежде чем включить прокрутку */
const MAX_HEIGHT = 140;

/** Поле отправки сообщения */
export const MessageComposer = ({ chatId }: IProps): ReactElement => {
	const [text, setText] = useState('');
	const fieldRef = useRef<HTMLTextAreaElement>(null);
	const { mutate, isPending, error } = useSendMessage(chatId);

	const trimmed = text.trim();

	const resize = (field: HTMLTextAreaElement): void => {
		field.style.height = 'auto';
		field.style.height = `${Math.min(Math.max(field.scrollHeight, SINGLE_ROW_HEIGHT), MAX_HEIGHT)}px`;
	};

	/** Отправка: общая для сабмита формы и для Enter */
	const submit = (): void => {
		if (trimmed === '' || isPending) {
			return;
		}

		mutate(trimmed, {
			onSuccess: () => {
				setText('');

				if (fieldRef.current) {
					fieldRef.current.style.height = `${SINGLE_ROW_HEIGHT}px`;
				}
			},
		});
	};

	/** Обработчик сабмита формы */
	const handleSubmit = (event: FormEvent): void => {
		event.preventDefault();
		submit();
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>): void => {
		if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) {
			return;
		}

		event.preventDefault();
		submit();
	};

	return (
		<form className={styles.composer} onSubmit={handleSubmit}>
			<textarea
				ref={fieldRef}
				className={styles.field}
				value={text}
				onChange={event => {
					setText(event.target.value);
					resize(event.target);
				}}
				onKeyDown={handleKeyDown}
				placeholder="Сообщение"
				rows={1}
				maxLength={MESSAGE_MAX_LENGTH}
			/>

			<Button type="submit" isLoading={isPending} disabled={trimmed === ''}>
				Отправить
			</Button>

			{error && <p className={styles.error}>{getApiErrorMessage(error)}</p>}
		</form>
	);
};
