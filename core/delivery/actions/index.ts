import { api } from '@/config/api';
import { CreateServiceDelivery, Delivery, DeliveryFilter, FilterDelivery, UpdateServiceDelivery } from '../interfaces';
import { ApiResponse } from '@/core/shared/interfaces';

/**
 *
 * @description Crear un servicio delivery de alfombras
 */
export const createDeliveryAction = async (values: CreateServiceDelivery): Promise<ApiResponse<Delivery>> => {
	try {
		const { data } = await api.post('/deliveries', values);
		return data;
	} catch (error) {
		throw error;
	}
};

/**
 *
 * @description Actualizar servicio delivery de alfombras
 */
export const updateDeliveryAction = async (values: UpdateServiceDelivery): Promise<ApiResponse<Delivery>> => {
	try {
		const { data } = await api.put(`/deliveries/${values.deliveryId}`, {
			price: values.price,
			paymentType: values.paymentType,
			cleaningStatus: values.cleaningStatus,
			clientName: values.clientName,
			status: values.status,
		});
		return data;
	} catch (error) {
		throw error;
	}
};

/**
 *
 * @description Obtener una lista de los deliverys alfombras
 */
export const getDeliveries = async (): Promise<ApiResponse<Delivery[]>> => {
	try {
		const { data } = await api.get('/deliveries');
		return data;
	} catch (error) {
		throw error;
	}
};

/**
 *
 * @description Obtener una lista de los deliverys alfombras por filtro
 */
export const getDeliveriesByFilter = async (values: FilterDelivery): Promise<ApiResponse<DeliveryFilter[]>> => {
	try {
		const { data } = await api.get('/deliveries/admin/filter-paged', {
			params: {
				paymentType: values.paymentType,
				status: values.status,
				pageSize: values.pageSize,
				pageNumber: values.pageNumber,
				clientName: values.clientName,
				eventType: values.eventType,
				assignmentStatus: values.assignmentStatus,
				cleanerId: values.cleanerId,
			},
		});
		return data;
	} catch (error) {
		throw error;
	}
};

/**
 *
 * @description Obtener un deliverys alfombras
 */
export const getDelivery = async (deliveryId: number): Promise<ApiResponse<Delivery>> => {
	try {
		const { data } = await api.get(`/deliveries/${deliveryId}`);
		return data;
	} catch (error) {
		throw error;
	}
};
