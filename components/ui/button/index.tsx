import React from 'react';
import { Pressable, PressableProps, Text, ViewStyle } from 'react-native';
import { CustomText, weight } from '../custom-text';
import { Spinner } from '../spinner';

interface Props extends Omit<PressableProps, 'style'> {
	children?: React.ReactNode;
	/**
	 * Texto para el botón
	 */
	text?: string;
	/**
	 * Estado de carga
	 */
	isLoading?: boolean;
	/**
	 * Color de fondo personalizado
	 */
	backgroundColor?: string;
	/**
	 * Variante del botón
	 */
	variant?: 'solid' | 'outline' | 'light';
	/**
	 * Clase CSS (si usas NativeWind)
	 */
	className?: string;
	/**
	 * Estilo personalizado
	 */
	style?: ViewStyle;
	/**
	 * Deshabilitar el botón
	 */
	disabled?: boolean;
}

// Configuración de estilos por variant
const getVariantStyles = (variant: 'solid' | 'outline' | 'light', backgroundColor?: string) => {
	const baseColor = backgroundColor || '#209f7b';

	switch (variant) {
		case 'solid':
			return {
				backgroundColor: baseColor,
				borderColor: baseColor,
				textColor: '#ffffff',
			};

		case 'outline':
			return {
				backgroundColor: 'transparent',
				borderColor: baseColor,
				textColor: baseColor,
			};

		case 'light':
			return {
				backgroundColor: `${baseColor}20`, // Agregar transparencia
				borderColor: 'transparent',
				textColor: baseColor,
			};

		default:
			return {
				backgroundColor: baseColor,
				borderColor: baseColor,
				textColor: '#000000',
			};
	}
};

export default function Button({
	children,
	text,
	isLoading = false,
	className,
	onPress,
	backgroundColor,
	variant = 'solid',
	style,
	disabled = false,
	...props
}: Props) {
	const variantStyles = getVariantStyles(variant, backgroundColor);
	const isDisabled = disabled || isLoading;

	const renderContent = () => {
		if (isLoading) {
			return <Spinner color={variant === 'solid' ? 'white' : variantStyles.textColor} />;
		}

		if (children) {
			return children;
		}

		return (
			<Text
				className='my-auto text-center'
				style={{
					color: variantStyles.textColor,
					fontFamily: weight.TitleMedium,
				}}>
				{text}
			</Text>
		);
	};

	return (
		<Pressable
			onPress={isDisabled ? undefined : onPress}
			className={className}
			style={[
				{
					backgroundColor: variantStyles.backgroundColor,
					borderWidth: 1,
					borderColor: variantStyles.borderColor,
					width: '100%',
					paddingVertical: 6,
					paddingHorizontal: 4,
					borderRadius: 40,
					minHeight: 50,
					justifyContent: 'center',
					alignItems: 'center',
					opacity: isDisabled ? 0.6 : 1,
				},
				style,
			]}
			disabled={isDisabled}
			{...props}>
			{renderContent()}
		</Pressable>
	);
}
