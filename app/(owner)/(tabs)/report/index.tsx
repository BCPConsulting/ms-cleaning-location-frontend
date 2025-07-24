import { View } from 'react-native';
import { CustomText } from '@/components/ui/custom-text';
import { Screen } from '@/components/ui/screen';

export default function ReportScreen() {
	return (
		<Screen isSafeAreaInsets={false}>
			<View className='flex-1 px-4'>
				<CustomText>Data</CustomText>
			</View>
		</Screen>
	);
}
