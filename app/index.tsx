import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { ThemedText } from '@/components/ThemedText';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { Screen } from '@/components/ui/screen';
import { useAuthStore } from '@/presentation/auth/store/use-auth-store';
import { paymentValidationAction, validateTokenAction, refreshTokenAction } from '@/core/auth/actions';

export default function Page() {
	const { user, loadSession, status, changeStatus } = useAuthStore();
	const [isInitializing, setIsInitializing] = useState(true);

	const [validationPayment, setValidationPayment] = useState<string>('');
	const [isPaymentLoading, setIsPaymentLoading] = useState(true);
	const [paymentError, setPaymentError] = useState(false);
	const [paymentValidated, setPaymentValidated] = useState(false);

	const [isTokenValidating, setIsTokenValidating] = useState(false);
	const [tokenError, setTokenError] = useState(false);
	const [authComplete, setAuthComplete] = useState(false);

	useEffect(() => {
		const checkPaymentValidation = async () => {
			try {
				setIsPaymentLoading(true);
				setPaymentError(false);

				const response = await paymentValidationAction();

				const paymentStatus = response.data || '';

				setValidationPayment(paymentStatus);

				if (paymentStatus === 'ACTIVE') {
					setPaymentValidated(true);
				} else {
					setPaymentValidated(false);
					setAuthComplete(true);
				}
			} catch (error) {
				console.error('💥 Error verificando pago:', error);
				setPaymentError(true);
				setPaymentValidated(false);
				setAuthComplete(true);
			} finally {
				setIsPaymentLoading(false);
			}
		};

		checkPaymentValidation();
	}, []);

	useEffect(() => {
		if (paymentValidated && !isPaymentLoading) {
			loadSession();
		}
	}, [paymentValidated, isPaymentLoading, loadSession]);

	useEffect(() => {
		if (!paymentValidated || isPaymentLoading) {
			return;
		}

		const handleTokenValidation = async () => {
			try {
				setIsTokenValidating(true);
				setTokenError(false);

				const tokenValidation = await validateTokenAction();

				if (tokenValidation.data === 'EXPIRED') {
					try {
						const refreshResponse = await refreshTokenAction();

						if (refreshResponse.data?.token && user) {
							await changeStatus(refreshResponse.data.token, user);
						}
					} catch (refreshError) {
						console.error('💥 Error refreshing token:', refreshError);
						setTokenError(true);
					}
				} else if (tokenValidation.data === 'NOT_EXPIRED') {
					console.log('✅ Token válido');
				} else {
					console.log('⚠️ Estado de token desconocido:', tokenValidation.data);
					setTokenError(true);
				}
			} catch (error) {
				console.error('💥 Error validating token:', error);
				setTokenError(true);
			} finally {
				setIsTokenValidating(false);
				setAuthComplete(true);
			}
		};

		if (user?.token && status === 'AUTHENTICATE') {
			handleTokenValidation();
		} else if (status === 'UNAUTHENTICATE' || !user?.token) {
			setTokenError(true);
			setAuthComplete(true);
		} else if (status !== 'CHECKING') {
			setIsTokenValidating(false);
			setAuthComplete(true);
		}
	}, [paymentValidated, user?.token, status, changeStatus]);

	useEffect(() => {
		const allValidationsComplete = !isPaymentLoading && authComplete;

		if (!allValidationsComplete) {
			return;
		}

		const handleNavigation = () => {
			// Si hay error de pago
			if (paymentError) {
				setIsInitializing(false);
				return;
			}

			// Si pago no está activo
			if (!paymentValidated || validationPayment !== 'ACTIVE') {
				setIsInitializing(false);
				return;
			}

			// Si hay error de token/autenticación
			if (tokenError || !user?.token || status === 'UNAUTHENTICATE') {
				router.replace('/auth/sign-in');
				setIsInitializing(false);
				return;
			}

			// Todo OK - Navegar según rol
			if (user.role === 'ADMIN' || user.role === 'OWNER') {
				router.replace('/(admin)/(tabs)/user');
			} else if (user.role === 'CLEANER') {
				router.replace('/(cleaner)/(tabs)/user');
			} else {
				router.replace('/auth/sign-in');
			}

			setIsInitializing(false);
		};

		handleNavigation();
	}, [isPaymentLoading, authComplete, paymentValidated, validationPayment, tokenError, paymentError, user, status]);

	useEffect(() => {
		async function getCurrentLocation() {
			try {
				let { status } = await Location.requestForegroundPermissionsAsync();
				if (status !== 'granted') {
					console.log('⚠️ Permisos de ubicación denegados');
				} else {
					console.log('✅ Permisos de ubicación concedidos');
				}
			} catch (error) {
				console.error('💥 Error solicitando permisos:', error);
			}
		}

		getCurrentLocation();
	}, []);

	// ✅ LOADING STATES
	if (isInitializing && (isPaymentLoading || isTokenValidating)) {
		const loadingMessage = isPaymentLoading
			? 'Validando estado de cuenta...'
			: isTokenValidating
			? 'Verificando sesión...'
			: 'Inicializando...';

		return (
			<GluestackUIProvider mode='dark'>
				<Screen>
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<ActivityIndicator
							color='#209f7b'
							size='large'
						/>
						<ThemedText style={{ marginTop: 16, opacity: 0.8 }}>{loadingMessage}</ThemedText>
					</View>
				</Screen>
			</GluestackUIProvider>
		);
	}

	// ✅ ERROR DE PAGO
	if (paymentError) {
		return (
			<GluestackUIProvider mode='dark'>
				<Screen>
					<View style={{ flex: 1, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center' }}>
						<ThemedText style={{ fontSize: 18, color: '#ff6b6b', textAlign: 'center', paddingHorizontal: 40 }}>
							Error al verificar el estado de tu cuenta.{'\n'}
							Por favor, intenta más tarde.
						</ThemedText>
					</View>
				</Screen>
			</GluestackUIProvider>
		);
	}

	// ✅ PAGO INACTIVO
	if (validationPayment !== 'ACTIVE') {
		return (
			<GluestackUIProvider mode='dark'>
				<Screen>
					<View style={{ flex: 1, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center' }}>
						<ThemedText style={{ fontSize: 18, opacity: 0.6, textAlign: 'center', paddingHorizontal: 40 }}>
							Tu cuenta no está activa.{'\n'}
							Contacta con soporte para más información.
						</ThemedText>
					</View>
				</Screen>
			</GluestackUIProvider>
		);
	}

	// ✅ Fallback
	return (
		<GluestackUIProvider mode='dark'>
			<Screen>
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<ThemedText>Redirigiendo...</ThemedText>
				</View>
			</Screen>
		</GluestackUIProvider>
	);
}
