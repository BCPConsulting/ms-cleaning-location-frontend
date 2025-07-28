import { JSX } from 'react';
import { StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
	children: JSX.Element | JSX.Element[];
	/**
	 * Espacio del area seguro de la pantalla
	 * @default true
	 */
	isSafeAreaInsets?: boolean;
}

export const Screen = ({ children, isSafeAreaInsets = true }: Props) => {
	const insets = useSafeAreaInsets();
	const valueSafeAreaInsets = isSafeAreaInsets ? { paddingTop: insets.top + 10 } : {};

	return (
		<View
			className='flex-1 bg-neutral-950'
			style={valueSafeAreaInsets}>
			<StatusBar backgroundColor='#0a0a0a' />
			<View className='flex-1 relative'>{children}</View>
		</View>
	);
};
