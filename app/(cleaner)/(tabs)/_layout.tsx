import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function AdminTabsLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor: '#18181b',
					borderColor: 'none',
				},
				tabBarActiveTintColor: '#2563eb',
				tabBarInactiveTintColor: '#a3a3a3',
				animation: 'none',
				tabBarShowLabel: true,
				tabBarHideOnKeyboard: true,
			}}>
			<Tabs.Screen
				name='my-assignments'
				options={{
					title: 'Asignaciones',
					tabBarLabel: 'Asignaciones',
					tabBarIcon: ({ color }) => (
						<Ionicons
							size={20}
							name='person-add-outline'
							color={color}
						/>
					),
				}}
			/>

			<Tabs.Screen
				name='my-assignments-carpets'
				options={{
					title: 'Asignaciones Alfombra',
					tabBarLabel: 'Asignaciones Alfombra',
					tabBarIcon: ({ color }) => (
						<Ionicons
							size={20}
							name='person-add-outline'
							color={color}
						/>
					),
				}}
			/>

			<Tabs.Screen
				name='user/index'
				options={{
					title: 'Perfil',
					tabBarLabel: 'Perfil',
					tabBarIcon: ({ color }) => (
						<Ionicons
							size={20}
							name='person-outline'
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
