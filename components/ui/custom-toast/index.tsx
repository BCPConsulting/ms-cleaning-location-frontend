import { Toast as ToastType, resolveValue } from '@backpackapp-io/react-native-toast';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { CustomText } from '../custom-text';

const DEFAULT_TOAST_HEIGHT = 50;

export default function CustomToast(toast: ToastType) {
	return (
		<View
			style={{
				backgroundColor: toast.type === 'success' ? '#1c2b22' : '#422b2b',
				minHeight: DEFAULT_TOAST_HEIGHT,
				width: toast.width,
				borderRadius: 6,
				flexDirection: 'row',
				alignItems: 'center',
				paddingVertical: 12,
				paddingHorizontal: 16,
				gap: 10,
			}}>
			<Ionicons
				name={toast.type === 'success' ? 'checkmark-circle-outline' : 'alert-circle-outline'}
				size={24}
				color={toast.type === 'success' ? '#a1f1c0' : '#fecaca'}
				className='mb-1'
			/>
			<CustomText
				styleCustom={{
					color: toast.type === 'success' ? '#a1f1c0' : '#fecaca',
				}}>
				{resolveValue(toast.message, toast)}
			</CustomText>
		</View>
	);
}
