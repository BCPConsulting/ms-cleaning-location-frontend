import { Role } from '@/core/shared/interfaces';

export interface UpdateUserRequest {
	id?: number;
	username: string;
	password?: string;
	phone: string;
	role: Role;
}
