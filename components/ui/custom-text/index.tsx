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
	Regular: 'WorkSansRegular',
	Medium: 'WorkSansMedium',
	SemiBold: 'WorkSansSemiBold',
	Bold: 'WorkSansBold',
	Title: 'SoraRegular',
	TitleMedium: 'SoraMedium',
	TitleSemiBold: 'SoraSemiBold',
	TitleBold: 'SoraBold',
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
