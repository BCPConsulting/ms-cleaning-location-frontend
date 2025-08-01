import { Pressable, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { CustomText, weight } from '@/components/ui/custom-text';
import { Screen } from '@/components/ui/screen';
import {
	Actionsheet,
	ActionsheetContent,
	ActionsheetItem,
	ActionsheetItemText,
	ActionsheetDragIndicator,
	ActionsheetDragIndicatorWrapper,
	ActionsheetBackdrop,
} from '@/components/ui/actionsheet';
import { useAuthStore } from '@/presentation/auth/store/use-auth-store';
import { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function UserScreen() {
	const { signOut } = useAuthStore();
	const [showActionsheet, setShowActionsheet] = useState(false);

	const handleClose = () => setShowActionsheet(false);

	const handleLogout = async () => {
		signOut();
	};

	return (
		<Screen isSafeAreaInsets={false}>
			<View className='flex-1 px-4'>
				<View className='flex-1'>
					<Pressable onPress={() => setShowActionsheet(true)}>
						<View className='flex-row'>
							<AntDesign
								name='logout'
								size={20}
								color='#e11d48'
							/>
							<ThemedText className='ml-5 text-neutral-300'>Cerrar sesión</ThemedText>
						</View>
					</Pressable>

					<Actionsheet
						isOpen={showActionsheet}
						onClose={handleClose}>
						<ActionsheetBackdrop />
						<ActionsheetContent>
							<ActionsheetDragIndicatorWrapper>
								<ActionsheetDragIndicator />
							</ActionsheetDragIndicatorWrapper>
							<ActionsheetItem onPress={() => handleLogout()}>
								<ActionsheetItemText>Aceptar</ActionsheetItemText>
							</ActionsheetItem>
							<ActionsheetItem onPress={handleClose}>
								<ActionsheetItemText>Cancelar</ActionsheetItemText>
							</ActionsheetItem>
						</ActionsheetContent>
					</Actionsheet>
				</View>
			</View>
		</Screen>
	);
}
