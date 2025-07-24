import { Stack } from 'expo-router/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function AdminLayout() {
	return (
		<SafeAreaProvider style={{ backgroundColor: 'black' }}>
			<Stack
				screenOptions={{
					headerShown: false,
					animation: 'none',
				}}>
				<Stack.Screen
					name='index'
					options={{ headerShown: false }}
				/>
			</Stack>
		</SafeAreaProvider>
	);
}
