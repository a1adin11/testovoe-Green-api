import type { ComponentPropsWithRef, ReactElement } from 'react';
import cn from 'classnames';

import { Spinner } from '../Spinner';
import styles from './Button.module.scss';

type TButtonVariant = 'primary' | 'outline' | 'text';

/**
 * @desc Пропсы кнопки
 *
 * @prop {TButtonVariant} variant - Вариант кнопки
 * @prop {boolean} fullWidth - Полная ширина
 * @prop {boolean} isLoading - Флаг загрузки
 * @prop {string} className - Css-класс
 */
export interface IProps extends ComponentPropsWithRef<'button'> {
	variant?: TButtonVariant;
	fullWidth?: boolean;
	isLoading?: boolean;
}

/** Компонент Button */
export const Button = ({
	variant = 'primary',
	fullWidth,
	isLoading,
	disabled,
	children,
	className,
	...props
}: IProps): ReactElement => (
	<button
		type="button"
		className={cn(styles.button, styles[variant], className, {
			[styles.fullWidth]: fullWidth,
		})}
		disabled={disabled || isLoading}
		aria-busy={isLoading}
		{...props}
	>
		{isLoading && <Spinner size="sm" color={variant === 'primary' ? 'light' : 'dark'} />}
		{children}
	</button>
);
