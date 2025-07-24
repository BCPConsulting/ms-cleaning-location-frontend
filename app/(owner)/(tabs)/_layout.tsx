import { Pressable, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomDrawerContent } from '@/components/custom-drawer-content';
import { CustomText, weight } from '@/components/ui/custom-text';
import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';

export default function AdminTabsLayout() {
	const insets = useSafeAreaInsets();

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<Drawer
				drawerContent={(props) => <CustomDrawerContent {...props} />}
				screenOptions={{
					header: ({ navigation, route, options }) => {
						return (
							<View
								className='flex-row items-center bg-neutral-950 px-4'
								style={{ paddingVertical: insets.top + 10 }}>
								<Pressable onPress={() => navigation.toggleDrawer()}>
									<Ionicons
										name='menu-outline'
										size={28}
										color='white'
									/>
								</Pressable>

								<CustomText
									variantWeight={weight.SemiBold}
									className='ml-4 flex-1 text-xl font-semibold capitalize text-white'>
									{options.title || route.name}
								</CustomText>
							</View>
						);
					},
					headerShown: true,
					drawerStyle: {
						backgroundColor: '#171717',
					},
				}}>
				<Drawer.Screen
					name='user/index'
					options={{
						title: 'Perfil',
					}}
				/>

				<Drawer.Screen
					name='report/index'
					options={{
						title: 'Reportes',
					}}
				/>
			</Drawer>
		</GestureHandlerRootView>
	);
}
