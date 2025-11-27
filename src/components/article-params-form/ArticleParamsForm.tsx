import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import styles from './ArticleParamsForm.module.scss';
import { useState, useRef, useEffect } from 'react';
import { Text } from 'src/ui/text';
import clsx from 'clsx';
import { Select } from 'src/ui/select';
import {
	ArticleStateType,
	backgroundColors,
	contentWidthArr,
	defaultArticleState,
	fontColors,
	fontFamilyOptions,
	fontSizeOptions,
} from 'src/constants/articleProps';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';

type ArticleParamsFormProps = {
	onApply: (state: ArticleStateType) => void;
	onReset: () => void;
};

export const ArticleParamsForm = ({
	onApply,
	onReset,
}: ArticleParamsFormProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [localState, setLocalState] =
		useState<ArticleStateType>(defaultArticleState);
	const asideRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				asideRef.current &&
				!asideRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};
		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	const toggleOpen = () => {
		setIsOpen((prev) => !prev);
	};

	const handleChange = <K extends keyof ArticleStateType>(
		key: K,
		option: ArticleStateType[K]
	) => {
		setLocalState((prev) => ({
			...prev,
			[key]: option,
		}));
	};

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		onApply(localState);
	};

	const handleResetClick = () => {
		setLocalState(defaultArticleState);
		onReset();
	};

	return (
		<>
			<ArrowButton isOpen={isOpen} onClick={toggleOpen} />
			<aside
				className={clsx(styles.container, { [styles.container_open]: isOpen })}
				ref={asideRef}>
				<form className={styles.form} onSubmit={handleSubmit}>
					<Text as={'h2'} size={31} weight={800} uppercase={true}>
						Задайте параметры
					</Text>

					<Select
						selected={localState.fontFamilyOption}
						options={fontFamilyOptions}
						placeholder='Open Sans'
						title='Шрифт'
						onChange={(opt) => handleChange('fontFamilyOption', opt)}
					/>

					<RadioGroup
						name='fontSize'
						options={fontSizeOptions}
						selected={localState.fontSizeOption}
						title='Размер шрифта'
						onChange={(opt) => handleChange('fontSizeOption', opt)}
					/>

					<Select
						selected={localState.fontColor}
						options={fontColors}
						placeholder='Чёрный'
						title='Цвет шрифта'
						onChange={(opt) => handleChange('fontColor', opt)}
					/>

					<Separator />

					<Select
						selected={localState.backgroundColor}
						options={backgroundColors}
						placeholder='Белый'
						title='Цвет фона'
						onChange={(opt) => handleChange('backgroundColor', opt)}
					/>

					<Select
						selected={localState.contentWidth}
						options={contentWidthArr}
						placeholder='Узкий'
						title='Ширина контента'
						onChange={(opt) => handleChange('contentWidth', opt)}
					/>

					<div className={styles.bottomContainer}>
						<Button
							title='Сбросить'
							htmlType='reset'
							type='clear'
							onClick={handleResetClick}
						/>
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
