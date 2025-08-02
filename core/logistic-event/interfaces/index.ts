import { AssignmentStatus, CleaningStatus, LogisticEventType } from '@/core/shared/interfaces';

export interface LogisticEvent {
	id: number;
	eventType: LogisticEventType;
	coordinates: string;
	locationName: string;
	locationReference: string;
	assignmentStatus: AssignmentStatus;
	cleaningStatus: CleaningStatus;
	cleanerId: number;
	dateTime: string;
	deliveryId: number;
}

export interface CreateLogisticEvent {
	eventType: LogisticEventType;
	coordinates: string;
	locationName: string;
	locationReference: string;
	cleanerId: string;
	deliveryId: string;
	assignmentStatus: AssignmentStatus;
	dateTime: string;
}

export interface UpdateLogisticEvent {
	id: number;
	eventType: LogisticEventType;
	coordinates: string;
	locationName: string;
	locationReference: string;
	cleanerId: string;
	deliveryId: string;
	assignmentStatus: AssignmentStatus;
	dateTime: string;
	cleaningStatus: CleaningStatus;
}
