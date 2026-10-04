import { useState } from 'react';
import type { ReactElement } from 'react';

import { useCredentials, useSessionStore } from '@entities/session';
import { Button } from '@shared/ui/Button';

import { useChatMessages } from './hooks/useChatMessages';
import { ChatSearch } from './ui/ChatSearch';
import { MessageComposer } from './ui/MessageComposer';
import { MessageList } from './ui/MessageList';
import styles from './ChatPage.module.scss';

export const ChatPage = (): ReactElement => {
	const credentials = useCredentials();
	const logout = useSessionStore(state => state.logout);
	const [chatId, setChatId] = useState<string | null>(null);

	const { messages, isLoading } = useChatMessages(chatId);

	return (
		<div className={styles.page}>
			<header className={styles.header}>
				<span className={styles.instance}>Инстанс {credentials?.idInstance}</span>
				<Button variant="text" onClick={logout}>
					Выйти
				</Button>
			</header>

			<ChatSearch onFound={setChatId} />

			{!chatId &&
				<p className={styles.hint}>Введите номер телефона, чтобы открыть диалог</p>
			}
			{chatId &&
				<>
					<MessageList messages={messages} isLoading={isLoading} />
					<MessageComposer chatId={chatId} />
				</>
			}
		</div>
	);
};
