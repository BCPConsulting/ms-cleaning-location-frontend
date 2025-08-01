import { View } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView, Pressable } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomDrawerContent } from '@/components/custom-drawer-content';
import { CustomText, weight } from '@/components/ui/custom-text';
import { useAuthStore } from '@/presentation/auth/store/use-auth-store';
import { Ionicons } from '@expo/vector-icons';

export default function AdminTabsLayout() {
	const { user } = useAuthStore();
	const insets = useSafeAreaInsets();

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<Drawer
				// drawerContent={(props) => <CustomDrawerContent {...props} />}

				screenOptions={{
					// header: ({ navigation, route, options }) => {
					// 	return (
					// 		<View
					// 			className='flex-row relative items-center bg-neutral-900 px-4'
					// 			style={{ paddingTop: insets.top + 10 }}>
					// 			<Pressable onPress={() => navigation.toggleDrawer()}>
					// 				<Ionicons
					// 					name='menu-outline'
					// 					size={28}
					// 					color='white'
					// 				/>
					// 			</Pressable>

					// 			<CustomText
					// 				variantWeight={weight.SemiBold}
					// 				className='text-xl  bg-red-600 items-center justify-center self-center w-full font-semibold capitalize text-white'>
					// 				{options.title || route.name}
					// 			</CustomText>
					// 		</View>
					// 	);
					// },
					headerTitleStyle: {
						fontFamily: weight.TitleMedium,
						fontSize: 16,
					},
					headerStyle: {
						backgroundColor: '#0a0a0a',
					},
					headerTitleAlign: 'center',
					drawerStyle: {
						backgroundColor: '#171717',
					},
					drawerLabelStyle: {
						fontFamily: weight.Regular,
					},

					drawerActiveTintColor: '#23AF87',

					// drawerHideStatusBarOnOpen: true,
				}}>
				<Drawer.Screen
					name='create-service/index'
					options={{
						title: 'Crear Servicio',
						headerShown: false,
					}}
				/>

				<Drawer.Screen
					name='assignments'
					options={{
						title: 'Asignaciones',
					}}
				/>

				<Drawer.Screen
					name='map-carpets'
					options={{
						title: 'Mapa alfombras',
						headerShown: false,
					}}
				/>

				<Drawer.Screen
					name='service-carpets'
					options={{
						title: 'Servicio alfombras',
						headerShown: true,
					}}
				/>

				<Drawer.Screen
					name='report/index'
					options={{
						title: 'Reportes',
						headerShown: true,
						drawerItemStyle: user?.role !== 'OWNER' ? { display: 'none' } : {},
					}}
				/>
				<Drawer.Screen
					name='cleaners'
					options={{
						title: 'Operarios',
						headerShown: true,
					}}
				/>
				<Drawer.Screen
					name='user/index'
					options={{
						title: 'Perfil',
						headerShown: true,
					}}
				/>
			</Drawer>
		</GestureHandlerRootView>
	);
}
