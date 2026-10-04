import type { ReactElement } from 'react';
import cn from 'classnames';

import { isTextMessage } from '../../types';
import type { TChatMessage } from '../../types';
import styles from './MessageList.module.scss';

interface IProps {
	messages: TChatMessage[];
	isLoading: boolean;
}

/** Текст сообщения или пометка о типе, который мы не отображаем */
const getText = (message: TChatMessage): string => {
	if (isTextMessage(message)) {
		return message.textMessage;
	}

	return message.textMessage ?? message.caption ?? `[${message.typeMessage}]`;
};

const formatTime = (timestamp: number): string =>
	new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/** Лента сообщений, от старых к новым */
export const MessageList = ({ messages, isLoading }: IProps): ReactElement => {
	if (isLoading) {
		return <p className={styles.placeholder}>Загружаем историю…</p>;
	}

	if (messages.length === 0) {
		return <p className={styles.placeholder}>Переписки пока нет. Отправьте первое сообщение</p>;
	}

	return (
		<ul className={styles.list}>
			{messages.map(message => (
				<li
					key={message.idMessage}
					className={cn(styles.message, message.type === 'outgoing' ? styles.outgoing : styles.incoming)}
				>
					<span className={styles.text}>{getText(message)}</span>
					<time className={styles.time}>{formatTime(message.timestamp)}</time>
				</li>
			))}
		</ul>
	);
};
