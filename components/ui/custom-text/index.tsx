import { StyleProp, StyleSheet, Text, TextProps, TextStyle } from 'react-native';

interface Props extends TextProps {
	children: React.ReactNode;
	/**
	 * Peso de la tipografía. Define qué tan gruesa será la fuente.
	 * @example variantWeight={weight.SemiBold}, more...
	 * @type {string}
	 */
	variantWeight?: string;
	variantTypeText?: VariantTypeText;
	styleCustom?: StyleProp<TextStyle>;
}

type VariantTypeText = 'title' | 'subtitle' | 'text';

export const weight = {
	Light: 'PoppinsLight',
	Regular: 'PoppinsRegular',
	Medium: 'PoppinsMedium',
	SemiBold: 'PoppinsSemiBold',
	Bold: 'PoppinsBold',
	Title: 'BebasNeueRegular',
};

export const CustomText = (props: Props) => {
	const { children, variantWeight, styleCustom } = props;
	const fontDefault = weight.Regular;
	const fontStyle = variantWeight ? variantWeight : fontDefault;

	return (
		<Text
			style={[styleCustom, { fontFamily: fontStyle }]}
			{...props}>
			{children}
		</Text>
	);
};
