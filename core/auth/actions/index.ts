import axios from 'axios';
import { api, apiPublic } from '@/config/api';
import { ApiResponse, Status } from '@/core/shared/interfaces';
import { SignInRequest, SignInResponse, SignUpRequest } from '../interfaces';

/**
 * @description Iniciar Sesión
 */
export const signInAction = async (values: SignInRequest): Promise<ApiResponse<SignInResponse>> => {
	const { username, password } = values;

	try {
		const { data } = await apiPublic.post('/auth/login', {
			username: username.toLocaleLowerCase(),
			password,
		});

		console.log('data', JSON.stringify(data, null, 2));

		return data;
	} catch (error: any) {
		throw error;
	}
};

/**
 * @description Crear usuarios
 */
export const signUpAction = async (values: SignUpRequest): Promise<ApiResponse<SignInResponse>> => {
	const { username, password, phone, role } = values;

	try {
		const { data } = await api.post('/auth/create-user', {
			username: username.toLocaleLowerCase(),
			password,
			phone,
			role,
		});

		return data;
	} catch (error: any) {
		throw error;
	}
};

/**
 * @description Obtener usuarios
 */
export const getUsers = async (values: SignInRequest): Promise<ApiResponse<SignInResponse>> => {
	const { username, password } = values;

	try {
		const { data } = await api.post('/auth/login', {
			username: username.toLocaleLowerCase(),
			password,
		});

		return data;
	} catch (error: any) {
		throw error;
	}
};

/**
 * @description Action para valir si cliente pago
 */
export const paymentValidationAction = async (): Promise<ApiResponse<Status>> => {
	try {
		const { data } = await axios.get('https://ms-cleaning-location.onrender.com/api/auth/payment-validation');

		return data;
	} catch (error: any) {
		throw error;
	}
};

/**
 * @description Refresh token
 */
export const refreshTokenAction = async (): Promise<
	ApiResponse<{
		token: string;
	}>
> => {
	try {
		const { data } = await api.post('/auth/refresh');

		return data;
	} catch (error: any) {
		throw error;
	}
};

/**
 * @description Validar token
 */
export const validateTokenAction = async (): Promise<ApiResponse<string>> => {
	try {
		const { data } = await api.get('/auth/token-validation');

		return data;
	} catch (error: any) {
		throw error;
	}
};
