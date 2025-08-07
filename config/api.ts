import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// ✅ API con autenticación (para endpoints protegidos)
export const api = axios.create({
	baseURL: 'http://192.168.18.8:8080/api',
	// baseURL: 'https://ms-cleaning-location.onrender.com/api',
});

// ✅ API pública (para login, registro, etc.)
export const apiPublic = axios.create({
	baseURL: 'http://192.168.18.8:8080/api',
	// baseURL: 'https://ms-cleaning-location.onrender.com/api',
});

// Interceptor solo para API autenticada
api.interceptors.request.use(async (config) => {
	const token = await SecureStore.getItemAsync('token');

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

// Interceptores de respuesta para ambas instancias
const responseInterceptor = (response: any) => {
	if (response.data.code && response.data.code !== '000') {
		const businessError = new Error(response.data.message || 'Error en la operación');
		(businessError as any).code = response.data.code;
		(businessError as any).isBusinessError = true;
		(businessError as any).data = response.data;
		return Promise.reject(businessError);
	}
	return response;
};

const errorInterceptor = (error: any) => {
	console.error('❌ Error HTTP/Red:', JSON.stringify(error, null, 2));
	return Promise.reject(error);
};

// Aplicar interceptores a ambas instancias
api.interceptors.response.use(responseInterceptor, errorInterceptor);

apiPublic.interceptors.response.use(responseInterceptor, errorInterceptor);
