import { User } from '@/core/auth/interfaces';
import { AssignmentStatus, CleaningStatus, PaymentType, Status } from '@/core/shared/interfaces';

export interface Appointment {
	id?: number;
	dateTime: Date;
	coordinates: string;
	paymentType: PaymentType;
	detail: string;
	cleaningStatus: CleaningStatus;
	assignmentStatus: AssignmentStatus;
	status: Status;
	cleaner: User;
}

export interface CreateApppointmentRequest {
	coordinates: string;
	price: number;
	detail: string;
	locationName: string;
	locationReference: string;
	clientName: string;
}

export interface UpdateApppointmentRequest extends CreateApppointmentRequest {
	appoinmentId: number;
	dateTime: string;
	cleanerId: number;
}

export interface FilterAssignmentAdminRequest {
	from: Date | string;
	to: Date | string;
	pageSize: number;
	pageNumber: number;
	cleanerId?: number;
}

export interface AssignmentAdminResponse {
	id: number;
	dateTime: Date;
	cleaningStatus: CleaningStatus;
	assignmentStatus: AssignmentStatus;
	cleanerId: number;
	detail: string;
	price: number;
	clientName: string;
	locationName: string;
	locationReference: string;
	coordinates: string;
}

export interface AssignmentCleanerRequest {
	appoinmentId: number;
	cleanerId: number;
}

export interface ChangeCompleteAppoinmentRequest {
	appointmentId: number;
	paymenType: PaymentType;
}
