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
				drawerContent={(props) => <CustomDrawerContent {...props} />}
				screenOptions={{
					header: ({ navigation, route, options }) => {
						return (
							<View
								className='flex-row items-center bg-neutral-950 px-4'
								style={{ paddingTop: insets.top + 10 }}>
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
					drawerStyle: {
						backgroundColor: '#171717',
					},
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
				{user?.role === 'OWNER' && (
					<Drawer.Screen
						name='report/index'
						options={{
							title: 'Reportes',
							headerShown: true,
						}}
					/>
				)}
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

// <Tabs
// 	screenOptions={{
// 		headerShown: false,
// 		tabBarStyle: {
// 			backgroundColor: '#18181b',
// 			borderColor: 'none',
// 		},
// 		tabBarActiveTintColor: '#2563eb',
// 		tabBarInactiveTintColor: '#a3a3a3',
// 		animation: 'none',
// 		tabBarShowLabel: true,
// 		tabBarHideOnKeyboard: true,
// 	}}>
// 	<Tabs.Screen
// 		name='create-service/index'
// 		options={{
// 			title: 'Crear Servicio',
// 			tabBarLabel: 'Crear Servicio',
// 			tabBarIcon: ({ color }) => (
// 				<Ionicons
// 					size={20}
// 					name='map-outline'
// 					color={color}
// 				/>
// 			),
// 		}}
// 	/>

// 	<Tabs.Screen
// 		name='assignments'
// 		options={{
// 			title: 'Asignaciones',
// 			tabBarLabel: 'Asignaciones',
// 			tabBarIcon: ({ color }) => (
// 				<Ionicons
// 					size={20}
// 					name='person-add-outline'
// 					color={color}
// 				/>
// 			),
// 		}}
// 	/>

// 	<Tabs.Screen
// 		name='user/index'
// 		options={{
// 			title: 'Perfil',
// 			tabBarLabel: 'Perfil',
// 			tabBarIcon: ({ color }) => (
// 				<Ionicons
// 					size={20}
// 					name='person-outline'
// 					color={color}
// 				/>
// 			),
// 		}}
// 	/>
// </Tabs>
