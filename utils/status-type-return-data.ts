import { CleaningStatus } from '@/core/shared/interfaces';

export const statusReturnTypeData = (cleaningStatus: CleaningStatus) => {
	switch (cleaningStatus) {
		case 'PENDING':
			return {
				name: 'Pendiente',
				color: '#57534e',
			};
		case 'IN_PROGRESS':
			return {
				name: 'En Progreso',
				color: '#f59e0b',
			};
		case 'COMPLETED':
			return {
				name: 'Completado',
				color: '#16a34a',
			};
		default:
			return {
				name: '',
				color: '',
			};
	}
};
