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
	const [isTokenValidating, setIsTokenValidating] = useState(true);
	const [tokenError, setTokenError] = useState(false);

	// ✅ 1. Cargar sesión al inicio
	useEffect(() => {
		loadSession();
	}, [loadSession]);

	// ✅ 2. Validar token cuando haya usuario autenticado
	useEffect(() => {
		const handleTokenValidation = async () => {
			try {
				setIsTokenValidating(true);
				setTokenError(false);

				console.log('🔐 Validando token...');
				const tokenValidation = await validateTokenAction();
				console.log('📝 Token validation result:', tokenValidation.data);

				if (tokenValidation.data === 'EXPIRED') {
					console.log('⏰ Token expirado, intentando refresh...');
					try {
						const refreshResponse = await refreshTokenAction();
						console.log('🔄 Token refreshed successfully');

						if (refreshResponse.data?.token && user) {
							await changeStatus(refreshResponse.data.token, user);
							console.log('✅ Token actualizado en el store');
						}
					} catch (refreshError) {
						console.error('💥 Error refreshing token:', refreshError);
						router.replace('/auth/sign-in');
						return;
					}
				} else if (tokenValidation.data === 'NOT_EXPIRED') {
					console.log('✅ Token válido, continuando...');
				} else {
					console.log('⚠️ Estado de token desconocido:', tokenValidation.data);
					setTokenError(true);
				}
			} catch (error) {
				console.error('💥 Error validating token:', error);
				setTokenError(true);
				router.replace('/auth/sign-in');
			} finally {
				setIsTokenValidating(false);
			}
		};

		if (user?.token && status === 'AUTHENTICATE') {
			handleTokenValidation();
		} else if (status !== 'CHECKING') {
			// Si no hay token o no está autenticado, saltar validación
			setIsTokenValidating(false);
		}
	}, [user?.token, status, changeStatus]);

	// ✅ 3. Validar pago cuando el token esté validado
	useEffect(() => {
		const checkPaymentValidation = async () => {
			try {
				setIsPaymentLoading(true);
				setPaymentError(false);

				console.log('💰 Verificando estado de pago...');
				const response = await paymentValidationAction();
				console.log('💰 Payment response:', response);

				setValidationPayment(response.data || '');
			} catch (error) {
				console.error('💥 Error verificando pago:', error);
				setPaymentError(true);
				setValidationPayment('');
			} finally {
				setIsPaymentLoading(false);
			}
		};

		// Solo verificar pago si el token es válido y el usuario está autenticado
		if (!isTokenValidating && !tokenError && user?.token && status === 'AUTHENTICATE') {
			checkPaymentValidation();
		} else if (!user?.token || status === 'UNAUTHENTICATE') {
			// Si no hay token, saltar validación de pago
			setIsPaymentLoading(false);
		}
	}, [isTokenValidating, tokenError, user?.token, status]);

	// ✅ 4. Manejar navegación cuando todo esté listo (SIN useCallback)
	useEffect(() => {
		const handleNavigation = async () => {
			console.log('🔍 Checking navigation conditions:', {
				status,
				isTokenValidating,
				isPaymentLoading,
				tokenError,
				paymentError,
				hasUser: !!user?.token,
				validationPayment,
			});

			// Esperar a que todo termine
			if (status === 'CHECKING' || isTokenValidating || isPaymentLoading) {
				console.log('⏳ Still loading...');
				return;
			}

			// Manejar errores de token
			if (tokenError) {
				console.log('❌ Token error, will show error screen');
				setIsInitializing(false);
				return;
			}

			// Si no hay usuario autenticado
			if (!user?.token || status === 'UNAUTHENTICATE') {
				console.log('❌ No authenticated user, redirecting to sign-in');
				router.replace('/auth/sign-in');
				setIsInitializing(false);
				return;
			}

			// Usuario autenticado, verificar pago
			if (paymentError) {
				console.log('❌ Payment error, will show error screen');
				setIsInitializing(false);
				return;
			}

			if (validationPayment === 'ACTIVE') {
				console.log('🎉 Payment active, navigating by role:', user.role);

				if (user.role === 'ADMIN' || user.role === 'OWNER') {
					console.log('🚀 Navigating to admin panel');
					router.replace('/(admin)/(tabs)/user');
				} else if (user.role === 'CLEANER') {
					console.log('🚀 Navigating to cleaner panel');
					router.replace('/(cleaner)/(tabs)/user');
				} else {
					console.log('⚠️ Unknown role:', user.role);
					router.replace('/auth/sign-in');
				}
			} else {
				console.log('⚠️ Payment not active:', validationPayment);
				// Se mostrará la pantalla negra
			}

			setIsInitializing(false);
		};

		handleNavigation();
	}, [status, isTokenValidating, isPaymentLoading, tokenError, paymentError, user?.token, user?.role, validationPayment]);

	// ✅ 5. Permisos de ubicación (independiente)
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

	// ✅ Loading states
	if (status === 'CHECKING' || isInitializing || isTokenValidating || isPaymentLoading) {
		const loadingMessage =
			status === 'CHECKING'
				? 'Verificando sesión...'
				: isTokenValidating
				? 'Validando token...'
				: isPaymentLoading
				? 'Validando pago...'
				: 'Inicializando...';

		console.log('🔄 Showing loading:', loadingMessage);

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

	// ✅ Error de token
	if (tokenError) {
		console.log('🔴 Showing token error screen');
		return (
			<GluestackUIProvider mode='dark'>
				<Screen>
					<View
						style={{
							flex: 1,
							backgroundColor: '#000000',
							justifyContent: 'center',
							alignItems: 'center',
						}}>
						<ThemedText
							style={{
								fontSize: 18,
								color: '#ff6b6b',
								textAlign: 'center',
								paddingHorizontal: 40,
							}}>
							Tu sesión ha expirado.{'\n'}
							Por favor, inicia sesión nuevamente.
						</ThemedText>
					</View>
				</Screen>
			</GluestackUIProvider>
		);
	}

	// ✅ Pantalla negra si pago no está activo
	if (validationPayment !== 'ACTIVE' && !paymentError) {
		console.log('🖤 Showing inactive payment screen');
		return (
			<GluestackUIProvider mode='dark'>
				<Screen>
					<View
						style={{
							flex: 1,
							backgroundColor: '#000000',
							justifyContent: 'center',
							alignItems: 'center',
						}}>
						<ThemedText
							style={{
								fontSize: 18,
								opacity: 0.6,
								textAlign: 'center',
								paddingHorizontal: 40,
							}}>
							Tu cuenta no está activa.{'\n'}
							Contacta con soporte para más información.
						</ThemedText>
					</View>
				</Screen>
			</GluestackUIProvider>
		);
	}

	// ✅ Error en payment validation
	if (paymentError) {
		console.log('🔴 Showing payment error screen');
		return (
			<GluestackUIProvider mode='dark'>
				<Screen>
					<View
						style={{
							flex: 1,
							backgroundColor: '#000000',
							justifyContent: 'center',
							alignItems: 'center',
						}}>
						<ThemedText
							style={{
								fontSize: 18,
								color: '#ff6b6b',
								textAlign: 'center',
								paddingHorizontal: 40,
							}}>
							Error al verificar el estado de tu cuenta.{'\n'}
							Por favor, intenta más tarde.
						</ThemedText>
					</View>
				</Screen>
			</GluestackUIProvider>
		);
	}

	// ✅ Fallback (no debería llegar aquí)
	console.log('⚠️ Reached fallback screen');
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
