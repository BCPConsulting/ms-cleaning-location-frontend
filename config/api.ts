import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const api = axios.create({
	// baseURL: API_URL,
	baseURL: 'http://192.168.18.4:8080/api',
	// baseURL: 'https://ms-cleaning-location.onrender.com/api',
});

api.interceptors.request.use(async (config) => {
	const token = await SecureStore.getItemAsync('token');

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

api.interceptors.response.use(
	(response) => {
		// Verificar si hay error en el body aunque HTTP sea 200
		if (response.data.code && response.data.code !== '000') {
			// Crear error personalizado para códigos de negocio
			const businessError = new Error(response.data.message || 'Error en la operación');
			(businessError as any).code = response.data.code;
			(businessError as any).isBusinessError = true;
			(businessError as any).data = response.data;

			return Promise.reject(businessError);
		}

		return response;
	},
	(error) => {
		console.error('❌ Error HTTP/Red:', error.message);
		return Promise.reject(error);
	}
);
