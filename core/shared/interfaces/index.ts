export type Role = 'OWNER' | 'ADMIN' | 'CLEANER';
export type Status = 'ACTIVE' | 'INACTIVE';
export type PaymentType = 'CASH' | 'YAPE' | 'TRANSFER' | 'PLIN';
export type CleaningStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type AssignmentStatus = 'UNASSIGNED' | 'ASSIGNED';
export type AuthStatus = 'AUTHENTICATE' | 'UNAUTHENTICATE' | 'CHECKING';

export interface ApiResponse<T> {
	code: string;
	message: string;
	data: T;
}
