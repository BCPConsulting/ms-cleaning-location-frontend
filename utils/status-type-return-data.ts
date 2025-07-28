import { CleaningStatus } from '@/core/shared/interfaces';

export const statusReturnTypeData = (cleaningStatus: CleaningStatus) => {
	switch (cleaningStatus) {
		case 'PENDING':
			return 'Pendiente';
		case 'IN_PROGRESS':
			return 'En Progreso';
		case 'COMPLETED':
			return 'Completado';
		default:
			return '-';
	}
};
