import { ErrorMessage } from 'formik';
import { ReactNode } from 'react';
import { StyleProp, TextInputProps, TextStyle, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { CustomText, weight } from '../custom-text';

interface Props extends TextInputProps {
	label?: string;
	/**
	 * Este parametro va de la mano con "editable"
	 */
	isDisabled?: boolean;
	/**
	 * Recibe un componente React, como un ícono.
	 * @example
	 * <MaterialIcons name="email" size={20} color="white" />
	 */
	IconLeft?: ReactNode;
	/**
	 * Recibe un componente React, como un ícono.
	 * @example
	 * <MaterialIcons name="email" size={20} color="white" />
	 */
	IconRight?: ReactNode;
	/**
	 * Recibe un valor boolean para mostrar error.
	 */
	error?: boolean;
	/**
	 * Nombre del campo para el estado Formik.
	 */
	name?: string;
	styleCustom?: StyleProp<TextStyle>;
}

export default function Input(props: Props) {
	const { label, isDisabled = false, IconLeft, IconRight, error, name } = props;

	const isIconLeft = IconLeft !== undefined ? IconLeft : null;
	const isIconRight = IconRight !== undefined ? IconRight : null;

	return (
		<View>
			{label?.length !== 0 && (
				<CustomText
					className='text-sm'
					styleCustom={{
						marginBottom: 4,
						color: '#a3a3a3',
						paddingTop: 5,
					}}>
					{label}
				</CustomText>
			)}

			<View
				style={{
					position: 'relative',
					flexDirection: 'row',
					alignItems: 'center',
					width: '100%',
					opacity: isDisabled ? 0.6 : 1,
					borderWidth: 1,
					paddingVertical: 6,
					paddingHorizontal: 8,
					borderRadius: 12,
					borderColor: error === true ? '#ef4444' : 'transparent',
					backgroundColor: error === true ? 'rgba(159, 18, 57, 0.4)' : 'rgba(62, 69, 73, 0.5)',
				}}>
				{IconLeft && <View>{IconLeft}</View>}

				<TextInput
					style={[
						props.styleCustom,
						{
							width: '100%',
							flex: 1,
							color: '#D5D5EE',
							fontFamily: weight.Regular,
						},
					]}
					placeholderTextColor={'#737373'}
					{...props}
				/>

				{IconRight && <View className='mr-3'>{IconRight}</View>}
			</View>

			{name && (
				<ErrorMessage
					name={name ?? ''}
					render={(message) => (
						<CustomText
							className='mt-2 text-sm text-rose-300'
							variantWeight={weight.Medium}>
							{message}
						</CustomText>
					)}
				/>
			)}
		</View>
	);
}
