import { useState } from 'react';
import type { ComponentPropsWithRef, MouseEvent, ReactElement, RefObject } from 'react';
import cn from 'classnames';

import SearchIcon from '@assets/icons/search.svg?react';
import ResetIcon from '@assets/icons/close.svg?react';
import EyeIcon from '@assets/icons/eye.svg?react';
import CloseEyeIcon from '@assets/icons/closeEye.svg?react';

import styles from './Input.module.scss';

/**
 * @desc Универсальный input
 *
 * @prop {string} type - Тип инпута
 * @prop {string | ReactElement} label - Название инпута
 * @prop {string} error - Текст ошибки
 * @prop {string} className - Css-класс
 * @prop {boolean} disabled - Флаг отключения инпута
 * @prop {boolean} resetSearch - Флаг отображения иконки сброса поиска
 * @prop {string} sizeVariant - Вариант размера
 * @prop {boolean} required - Флаг обязательности поля
 */
interface IProps extends ComponentPropsWithRef<'input'> {
	type?: 'text' | 'password' | 'search';
	label?: string | ReactElement;
	error?: string | null;
	className?: string;
	disabled?: boolean;
	resetSearch?: () => void;
	sizeVariant?: 'sm' | 'md' | 'lg';
	onClick?: () => void;
	required?: boolean;
	inputWrapperRef?: RefObject<HTMLDivElement | null>;
}

/** Компонент input */
export const Input = ({
	type,
	label,
	error,
	className,
	disabled,
	resetSearch,
	sizeVariant = 'md',
	onClick,
	required = false,
	inputWrapperRef,
	...props
}: IProps): ReactElement => {
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	const inputType = type === 'password' ? (isPasswordVisible ? 'text' : 'password') : type;
	const isClickable = !!onClick && !disabled;

	/** Обработчик переключения видимости пароля */
	const togglePasswordVisibility = (e: MouseEvent): void => {
		e.preventDefault();
		setIsPasswordVisible(prev => !prev);
	};

	/** Обработчик сброса поиска */
	const handleResetSearch = (e: MouseEvent): void => {
		e.preventDefault();
		resetSearch?.();
	};

	return (
		<label
			className={cn(styles.wrapper, className, {
				[styles.password]: type === 'password',
				[styles.search]: type === 'search',
			})}
		>
			{label && (
				<div className={styles.label}>
					{label}
					{required && <span className={styles.required}>*</span>}
				</div>
			)}
			<div
				ref={inputWrapperRef}
				className={cn(styles.inputWrapper, styles[sizeVariant], {
					[styles.errorBorder]: !!error,
					[styles.disabled]: disabled,
					[styles.clickable]: isClickable,
				})}
			>
				{type === 'search' && (
					<SearchIcon className={styles.searchIcon} width={16} height={16} />
				)}
				<input
					disabled={disabled}
					type={inputType}
					required={required}
					aria-invalid={!!error}
					onClick={onClick}
					{...props}
				/>
				{type === 'search' && (
					<button
						type="button"
						className={styles.rightIconWrapper}
						disabled={disabled}
						aria-label="Очистить поиск"
						onClick={handleResetSearch}
					>
						<ResetIcon width={20} height={20} />
					</button>
				)}
				{type === 'password' && (
					<button
						type="button"
						className={styles.rightIconWrapper}
						disabled={disabled}
						aria-label={isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'}
						aria-pressed={isPasswordVisible}
						onClick={togglePasswordVisibility}
					>
						{isPasswordVisible ? <CloseEyeIcon width={20} height={20} /> : <EyeIcon width={20} height={20} />}
					</button>
				)}
			</div>
			{error && <p className={styles.error}>{error}</p>}
		</label>
	);
};
