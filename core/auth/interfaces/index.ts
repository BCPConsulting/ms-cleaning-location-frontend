import { Role, Status } from '../../shared/interfaces';

export interface User {
	id?: number;
	username: string;
	phone: string;
	role: Role;
	status: Status;
	token: string;
	coordinates: string;
}

export interface SignInResponse extends Omit<User, 'id'> {}

export interface SignInRequest {
	username: string;
	password: string;
}
