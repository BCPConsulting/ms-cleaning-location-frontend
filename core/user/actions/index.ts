import { api } from '@/config/api';
import { User } from '@/core/auth/interfaces';
import { ApiResponse } from '@/core/shared/interfaces';

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
