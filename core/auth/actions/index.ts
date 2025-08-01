import { api } from '@/config/api';
import { ApiResponse } from '@/core/shared/interfaces';
import { SignInRequest, SignInResponse, SignUpRequest } from '../interfaces';

/**
 * @description Iniciar Sesión
 */
export const signInAction = async (values: SignInRequest): Promise<ApiResponse<SignInResponse>> => {
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
