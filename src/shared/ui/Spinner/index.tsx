import type { ReactElement } from 'react';
import cn from 'classnames';
import styles from './Spinner.module.scss';

/**
 * @desc Интерфейс
 *
 * @prop {string} position - Позиция
 * @prop {'sm' | 'md' | 'lg'} size - Размер
 * @prop {'light' | 'dark'} color - Цвет
 * @prop {string} className - Css-класс
 */
export interface IProps {
	position?: 'absolute' | 'fixed';
	size?: 'sm' | 'md' | 'lg';
	color?: 'light' | 'dark';
	className?: string;
}

/** Компонент Spinner */
export const Spinner = ({ position, size = 'md', color = 'dark', className }: IProps): ReactElement => {
	return (
		<div
			className={cn(styles.wrapper, className, {
				[styles.fixed]: position === 'fixed',
				[styles.absolute]: position === 'absolute',
			})}
		>
			<div className={cn(styles.loader, styles[size], styles[color])} />
		</div>
	);
};
