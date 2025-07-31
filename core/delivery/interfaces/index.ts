import { LogisticEvent } from '@/core/logistic-event/interfaces';
import { AssignmentStatus, CleaningStatus, PaymentType, Status } from '@/core/shared/interfaces';

export interface Delivery {
	id: number;
	price: number;
	paymentType: PaymentType;
	cleaningStatus: CleaningStatus;
	status: Status;
	clientName: string;
	logisticEvents: LogisticEvent[];
}

export interface DeliveryFilter {
	deliveryId: number;
	price: number;
	paymentType: PaymentType;
	cleaningStatus: CleaningStatus;
	status: Status;
	clientName: string;
	logisticEvents: LogisticEvent[];
}

export interface CreateServiceDelivery {
	price: string;
	paymentType: PaymentType;
	clientName: string;
	status: Status;
	cleaningStatus: CleaningStatus;
}

export interface UpdateServiceDelivery {
	deliveryId: number;
	price: string;
	paymentType: PaymentType;
	clientName: string;
	status: Status;
	cleaningStatus: CleaningStatus;
}

export interface FilterDelivery {
	paymentType?: PaymentType;
	status?: Status;
	pageSize: number;
	pageNumber: number;
	clientName?: string;
	eventType?: LogisticEvent;
	assignmentStatus?: AssignmentStatus;
	cleanerId?: string;
}
