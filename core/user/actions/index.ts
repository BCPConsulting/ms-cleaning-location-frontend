import { api } from '@/config/api';
import { User } from '@/core/auth/interfaces';
import { ApiResponse } from '@/core/shared/interfaces';
import { UpdateUserRequest } from '../interfaces';

/**
 *
 * @description Servicio para traerme a todo los operarios
 */
export const getAllCleanersAction = async (): Promise<ApiResponse<User[]>> => {
	try {
		const { data } = await api.get(`/users/cleaners`);
		return data;
	} catch (error) {
		throw error;
	}
};

/**
 *
 * @description Servicio para compartir coordenadas de operario
 */
export const updateCoordinatesAction = async (coordinates: string): Promise<ApiResponse<User>> => {
	try {
		const { data } = await api.put(`/users/share-coordinates/${coordinates}`);
		return data;
	} catch (error) {
		throw error;
	}
};

/**
 * @description Actualiar usuario
 */
export const updateUserAction = async (values: UpdateUserRequest): Promise<ApiResponse<User>> => {
	try {
		const { data } = await api.put(`/users/${values.id}`, {
			username: values.username,
			password: values.password,
			role: values.role,
			phone: values.phone,
		});

		return data;
	} catch (error: any) {
		throw error;
	}
};

/**
 * @description Eliminar usuario
 */
export const deleteUserAction = async (userId: number): Promise<ApiResponse<string>> => {
	try {
		const { data } = await api.delete(`/users/${userId}`);

		return data;
	} catch (error: any) {
		throw error;
	}
};
