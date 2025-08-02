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
import { usePaymentValidation } from '@/presentation/auth/hooks/use-payment-validation';

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
		WorkSansBold: require('../assets/fonts/WorkSans-Bold.ttf'),
		WorkSansMedium: require('../assets/fonts/WorkSans-Medium.ttf'),
		WorkSansRegular: require('../assets/fonts/WorkSans-Regular.ttf'),
		WorkSansSemiBold: require('../assets/fonts/WorkSans-SemiBold.ttf'),
		SoraBold: require('../assets/fonts/Sora-Bold.ttf'),
		SoraSemiBold: require('../assets/fonts/Sora-SemiBold.ttf'),
		SoraRegular: require('../assets/fonts/Sora-Regular.ttf'),
		SoraMedium: require('../assets/fonts/Sora-Medium.ttf'),
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
		<GestureHandlerRootView style={{ backgroundColor: '#222', flex: 1 }}>
			<GluestackUIProvider mode='dark'>
				<SafeAreaProvider style={{ backgroundColor: 'black' }}>
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
				</SafeAreaProvider>
			</GluestackUIProvider>
		</GestureHandlerRootView>
	);
}
