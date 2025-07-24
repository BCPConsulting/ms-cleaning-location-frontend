import { api } from '@/config/api';
import { ApiResponse } from '@/core/shared/interfaces';
import { SignInRequest, SignInResponse } from '../interfaces';

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
