import MapViewContext from '@/context/map-view-context';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function AssignmentsLayout() {
	return (
		<MapViewContext>
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
						name='map-view/index'
						options={{ headerShown: false }}
					/>

					<Stack.Screen
						name='[id]'
						options={{ headerShown: false }}
					/>
				</Stack>
			</SafeAreaProvider>
		</MapViewContext>
	);
}
