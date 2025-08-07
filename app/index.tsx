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

	// ✅ NUEVO: Estado para controlar carga de sesión
	const [sessionLoaded, setSessionLoaded] = useState(false);

	// 🔄 1. PRIMERO: Cargar sesión AL INICIO (antes que todo)
	useEffect(() => {
		console.log('🚀 Iniciando carga de sesión...');
		const initSession = async () => {
			await loadSession();
			setSessionLoaded(true);
			console.log('✅ Sesión inicial cargada');
		};
		initSession();
	}, [loadSession]);

	// 🔄 2. SEGUNDO: Validar pago SOLO si hay sesión válida
	useEffect(() => {
		if (!sessionLoaded) return;

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
	}, [sessionLoaded, user, status]);

	// 🔄 3. TERCERO: Validar token si está autenticado y pago es válido
	useEffect(() => {
		if (!sessionLoaded || isPaymentLoading || validationPayment === 'INACTIVE') return;

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
					console.log('Token válido');
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

		// ✅ Validar token solo si hay usuario y pago es válido
		if (paymentValidated && user?.token && status === 'AUTHENTICATE') {
			console.log('🔐 Validando token...');
			handleTokenValidation();
		} else {
			console.log('⏭️ Saltando validación de token');
			setIsTokenValidating(false);
			setAuthComplete(true);
		}
	}, [sessionLoaded, paymentValidated, isPaymentLoading, user, status, changeStatus]);

	// 🔄 4. CUARTO: Navegación final
	useEffect(() => {
		if (!sessionLoaded) return;

		const allValidationsComplete = !isPaymentLoading && authComplete;

		if (!allValidationsComplete) {
			return;
		}

		const handleNavigation = () => {
			if (paymentError) {
				console.log('❌ Error de pago - Mostrando pantalla de error');
				setIsInitializing(false);
				return;
			}

			if (!paymentValidated || validationPayment !== 'ACTIVE') {
				console.log('❌ Pago inactivo - Mostrando pantalla negra');
				setIsInitializing(false);
				return;
			}

			if (tokenError || !user?.token || status === 'UNAUTHENTICATE') {
				console.log('❌ Error de autenticación - Redirigiendo a login');
				router.replace('/auth/sign-in');
				setIsInitializing(false);
				return;
			}

			if (user.role === 'ADMIN' || user.role === 'OWNER') {
				router.replace('/(admin)/(tabs)/user');
			} else if (user.role === 'CLEANER') {
				router.replace('/(cleaner)/(tabs)/user');
			} else {
				console.log('⚠️ Rol desconocido - Redirigiendo a login');
				router.replace('/auth/sign-in');
			}

			setIsInitializing(false);
		};

		handleNavigation();
	}, [
		sessionLoaded,
		isPaymentLoading,
		authComplete,
		paymentError,
		paymentValidated,
		validationPayment,
		tokenError,
		user,
		status,
	]);

	// 🔄 5. Permisos de ubicación (independiente)
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

	if (isInitializing && (!sessionLoaded || isPaymentLoading || isTokenValidating)) {
		const loadingMessage = !sessionLoaded
			? 'Cargando sesión...'
			: isPaymentLoading
			? 'Validando estado de cuenta...'
			: isTokenValidating
			? 'Verificando token...'
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

	//ERROR DE PAGO
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

	//PAGO INACTIVO
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

	//Fallback
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
