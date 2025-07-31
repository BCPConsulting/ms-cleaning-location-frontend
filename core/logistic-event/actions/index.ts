import { api } from '@/config/api';
import { CreateLogisticEvent, LogisticEvent, UpdateLogisticEvent } from '../interfaces';
import { ApiResponse } from '@/core/shared/interfaces';

/**
 *
 * @description Crear un servicio de evento delivery de alfombras
 */
export const createLogisticEventAction = async (values: CreateLogisticEvent): Promise<ApiResponse<CreateLogisticEvent>> => {
	try {
		const { data } = await api.post('/logistic-events', values);
		return data;
	} catch (error) {
		throw error;
	}
};

/**
 *
 * @description Actualiar servicio de evento delivery de alfombras
 */
export const updateLogisticEventAction = async (values: UpdateLogisticEvent): Promise<ApiResponse<LogisticEvent>> => {
	console.log(
		'VALUES',
		JSON.stringify(
			{
				eventType: values.eventType,
				coordinates: values.coordinates,
				locationName: values.locationName,
				locationReference: values.locationReference,
				cleanerId: values.cleanerId,
				deliveryId: values.deliveryId,
				assignmentStatus: values.assignmentStatus,
				dateTime: values.dateTime,
			},
			null,
			2
		)
	);

	try {
		const { data } = await api.put(`/logistic-events/${values.id}`, {
			eventType: values.eventType,
			coordinates: values.coordinates,
			locationName: values.locationName,
			locationReference: values.locationReference,
			cleanerId: values.cleanerId,
			deliveryId: values.deliveryId,
			assignmentStatus: values.assignmentStatus,
			dateTime: values.dateTime,
		});
		return data;
	} catch (error) {
		throw error;
	}
};

/**
 *
 * @description Obtener todos los logistic event
 */
export const getAllLogisticEventAction = async (): Promise<ApiResponse<LogisticEvent[]>> => {
	try {
		const { data } = await api.get('/logistic-events');
		return data;
	} catch (error) {
		throw error;
	}
};
