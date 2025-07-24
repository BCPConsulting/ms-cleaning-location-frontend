import { Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export interface Props {
	navigation?: () => void;
}

export default function ButtonBack({ navigation }: Props) {
	const handlePress = () => {
		if (navigation) {
			navigation();
		} else {
			router.back();
		}
	};

	return (
		<Pressable
			onPress={() => handlePress()}
			className='items-center justify-center self-start rounded-2xl border border-neutral-700 bg-neutral-900 p-3'>
			<Ionicons
				name='chevron-back'
				size={24}
				color='white'
			/>
		</Pressable>
	);
}
