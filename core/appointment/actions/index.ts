import { api } from '@/config/api';
import {
	CreateApppointmentRequest,
	AssignmentAdminResponse,
	FilterAssignmentAdminRequest,
	Appointment,
	AssignmentCleanerRequest,
	ChangeCompleteAppoinmentRequest,
	UpdateApppointmentRequest,
} from '../interfaces';
import { ApiResponse } from '@/core/shared/interfaces';

/**
 *
 * @description Crear un servicio
 */
export const createAppointmentAction = async (values: CreateApppointmentRequest): Promise<void> => {
	console.log('Values', JSON.stringify(values, null, 2));

	try {
		const { data } = await api.post('/appointments', values);
		return data;
	} catch (error) {
		throw error;
	}
};

/**
 *
 * @description Actualiar cita de servicio
 */
export const updateAppoinmentAction = async (values: UpdateApppointmentRequest): Promise<ApiResponse<Appointment>> => {
	try {
		const { data } = await api.put(`/appointments/${values.appoinmentId}`, {
			dateTime: values.dateTime,
			coordinates: values.coordinates,
			phone: values.phone,
			price: values.price,
			detail: values.detail,
			cleanerId: values.cleanerId,
			clientName: values.locationName,
			locationName: values.locationName,
			locationReference: values.locationReference,
		});
		return data;
	} catch (error) {
		throw error;
	}
};

/**
 *
 * @description Obtener la cita de servicio por id
 */
export const getAppoinmentIdAction = async (appoinmentId: number): Promise<ApiResponse<Appointment>> => {
	try {
		const { data } = await api.get(`/appointments/${appoinmentId}`);
		return data;
	} catch (error) {
		throw error;
	}
};

/**
 *
 * @description Lista de asignamientos con filtros para propietario
 */
export const getAssignmentsOwnerAction = async (
	values: FilterAssignmentAdminRequest
): Promise<ApiResponse<AssignmentAdminResponse[]>> => {
	try {
		const { data } = await api.get('/appointments/owner/filter-paged', {
			params: {
				from: values.from,
				to: values.to,
				pageSize: values.pageSize,
				pageNumber: values.pageNumber,
				paymentType: values.paymentType,
				cleanerId: values.cleanerId,
			},
		});

		console.log('data', JSON.stringify(data, null, 2));

		return data;
	} catch (error) {
		throw error;
	}
};

/**
 *
 * @description Lista de asignamientos con filtros para administrador
 */
export const getAssignmentsAdminAction = async (
	values: FilterAssignmentAdminRequest
): Promise<ApiResponse<AssignmentAdminResponse[]>> => {
	try {
		const { data } = await api.get('/appointments/admin/filter-paged', {
			params: {
				from: values.from,
				to: values.to,
				pageSize: values.pageSize,
				pageNumber: values.pageNumber,
			},
		});
		return data;
	} catch (error) {
		throw error;
	}
};

/**
 *
 * @description Lista de asignamientos con filtros para operario
 */
export const getAssignmentsCleanerAction = async (
	values: FilterAssignmentAdminRequest
): Promise<ApiResponse<AssignmentAdminResponse[]>> => {
	console.log('Llamando de nuevo');

	try {
		const { data } = await api.get('/appointments/cleaner/filter-paged', {
			params: {
				from: values.from,
				to: values.to,
				pageSize: values.pageSize,
				pageNumber: values.pageNumber,
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
 * @description Asignar operarios de limpieza a los servicios
 */
export const assignmentCleanerAction = async (values: AssignmentCleanerRequest): Promise<ApiResponse<Appointment>> => {
	console.log('values', JSON.stringify(values, null, 2));

	try {
		const { data } = await api.put(`/appointments/assign/${values.appoinmentId}`, undefined, {
			params: {
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
 * @description Cambiar el estado del servicio "EN PROGRESO"
 */
export const changeInProgressAction = async (appointmentId: number): Promise<ApiResponse<Appointment>> => {
	try {
		const { data } = await api.put(`/appointments/changeInProgress/${appointmentId}`);
		return data;
	} catch (error) {
		throw error;
	}
};

/**
 *
 * @description Cambiar el estado del servicio "COMPLETADO"
 */
export const changeCompletedAction = async (values: ChangeCompleteAppoinmentRequest): Promise<ApiResponse<Appointment>> => {
	try {
		const { data } = await api.put(`/appointments/changeCompleted/${values.appointmentId}`, undefined, {
			params: {
				paymentType: values.paymenType,
			},
		});
		return data;
	} catch (error) {
		throw error;
	}
};

/**
 *
 * @description Eliminar la cita del servicio
 */
export const deleteAppointmentAction = async (appoinmentId: number): Promise<ApiResponse<null>> => {
	try {
		const { data } = await api.delete(`/appointments/${appoinmentId}`);
		return data;
	} catch (error) {
		throw error;
	}
};
