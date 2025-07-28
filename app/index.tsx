import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { ThemedText } from '@/components/ThemedText';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { Screen } from '@/components/ui/screen';
import { useAuthStore } from '@/presentation/auth/store/use-auth-store';

export default function Page() {
	const { user, loadSession, token, status } = useAuthStore();
	const [isInitializing, setIsInitializing] = useState(true);

	const checkAuthStatus = useCallback(async () => {
		try {
			if (!user.token) {
				router.replace('/auth/sign-in');
				return;
			}

			if (!user) {
				router.replace('/auth/sign-in');
				return;
			}

			// Navegar según el rol del usuario
			if (user.role === 'ADMIN' || user.role === 'OWNER') {
				router.replace('/(admin)/(tabs)/user');
			} else if (user.role === 'CLEANER') {
				router.replace('/(cleaner)/(tabs)/user');
			} else {
				router.replace('/auth/sign-in');
			}
		} catch (error) {
			router.replace('/auth/sign-in');
		} finally {
			setIsInitializing(false);
		}
	}, [token, user, status]);

	useEffect(() => {
		loadSession();
	}, [loadSession]);

	useEffect(() => {
		if (status === 'CHECKING') return;

		checkAuthStatus();
	}, [status, checkAuthStatus]);

	useEffect(() => {
		async function getCurrentLocation() {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				return;
			}
		}

		getCurrentLocation();
	}, []);

	if (status === 'CHECKING' || isInitializing) {
		return (
			<GluestackUIProvider mode='dark'>
				<Screen>
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<ActivityIndicator color='yellow' />
					</View>
				</Screen>
			</GluestackUIProvider>
		);
	}

	return (
		<GluestackUIProvider mode='dark'>
			<Screen>
				<View className='flex-1'>
					<ThemedText>Redirec....</ThemedText>
				</View>
			</Screen>
		</GluestackUIProvider>
	);
}
