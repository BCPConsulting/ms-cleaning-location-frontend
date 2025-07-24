import { JSX, useEffect } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toasts } from '@backpackapp-io/react-native-toast';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import '../global.css';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
		},
	},
});

const AuthProvider = ({ children }: { children: JSX.Element }) => {
	return (
		<View
			className='flex-1 bg-rose-700'
			style={{ backgroundColor: 'black' }}>
			{children}
			<Toasts />
		</View>
	);
};

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded, error] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
	});

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded, error]);

	if (!loaded && !error) {
		// Async font loading only occurs in development.
		return null;
	}

	return (
		<GluestackUIProvider mode='dark'>
			<SafeAreaProvider style={{ backgroundColor: 'black' }}>
				<GestureHandlerRootView style={{ backgroundColor: '#222', flex: 1 }}>
					<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
						<QueryClientProvider client={queryClient}>
							<AuthProvider>
								<Stack>
									<Stack.Screen
										name='index'
										options={{ headerShown: false }}
									/>
									<Stack.Screen
										name='auth/sign-in/index'
										options={{ headerShown: false }}
									/>
									<Stack.Screen
										name='(admin)'
										options={{ headerShown: false }}
									/>
									<Stack.Screen
										name='(cleaner)'
										options={{ headerShown: false }}
									/>
									<Stack.Screen
										name='(owner)'
										options={{ headerShown: false }}
									/>
									<Stack.Screen name='+not-found' />
								</Stack>
							</AuthProvider>
						</QueryClientProvider>
					</ThemeProvider>
				</GestureHandlerRootView>
			</SafeAreaProvider>
		</GluestackUIProvider>
	);
}
