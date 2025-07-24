import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function AssignmentsLayout() {
	return (
		<SafeAreaProvider style={{ backgroundColor: 'black' }}>
			<Stack
				screenOptions={{
					animation: 'none',
				}}>
				<Stack.Screen
					name='index'
					options={{ headerShown: false }}
				/>

				<Stack.Screen
					name='appoinment-admin/index'
					options={{
						headerShown: false,
					}}
				/>
			</Stack>
		</SafeAreaProvider>
	);
}
