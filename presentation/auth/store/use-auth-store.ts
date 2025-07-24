import { User } from '@/core/auth/interfaces';
import { AuthStatus } from '@/core/shared/interfaces';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

export interface AuthStoreTypes {
	status: AuthStatus;
	token?: string;
	user: User;
	// login: (email: string, password: string) => Promise<boolean>;
	// register: (
	// 	name: string,
	// 	email: string,
	// 	cel: string,
	// 	password: string,
	// 	identityDocument: string,
	// 	role: 'CLIENT' | 'ASSOCIATE' | 'ADMIN',
	// 	code: string
	// ) => Promise<UserRegisterResponse>;
	// updateUser: (clientId: string, values: UserUpdateRequest) => Promise<UserUpdateResponse | undefined>;
	// codeVerification: (email: string) => Promise<string>;
	loadSession: () => Promise<void>;
	signOut: () => Promise<void>;
	changeStatus: (token: string, user: User) => Promise<void>;
}

export const useAuthStore = create<AuthStoreTypes>()((set, get) => ({
	// Estado inicial
	status: 'CHECKING',
	user: {} as User,

	loadSession: async () => {
		try {
			set({ status: 'CHECKING' });

			const userSecure = await SecureStore.getItemAsync('user');
			const token = await SecureStore.getItemAsync('token');

			if (!userSecure || !token) {
				set({ status: 'UNAUTHENTICATE', user: {} as User });
				return;
			}

			const user = JSON.parse(userSecure);

			set({ status: 'AUTHENTICATE', user, token });
		} catch (error) {
			set({ status: 'UNAUTHENTICATE', user: {} as User });
		}
	},

	changeStatus: async (token?: string, user?: User) => {
		if (!token || !user) {
			set({ status: 'UNAUTHENTICATE', user: {} as User });
			await SecureStore.deleteItemAsync('token');
			await SecureStore.deleteItemAsync('user');

			return;
		}

		set({ status: 'AUTHENTICATE', user, token });

		SecureStore.setItemAsync('token', token);
		SecureStore.setItemAsync('user', JSON.stringify(user));
	},

	// register: async (
	// 	name: string,
	// 	email: string,
	// 	cel: string,
	// 	password: string,
	// 	identityDocument: string,
	// 	role: 'CLIENT' | 'ASSOCIATE' | 'ADMIN',
	// 	code: string
	// ): Promise<UserRegisterResponse> => {
	// 	set({ status: 'checking' });
	// 	try {
	// 		const response = await authRegister(name, email, cel, password, identityDocument, role, code);
	// 		set({
	// 			status: 'authenticated',
	// 			user: {
	// 				userId: response.id,
	// 				...response,
	// 			},
	// 		});
	// 		return response;
	// 	} catch (error) {
	// 		set({ status: 'unauthenticated' });
	// 		throw error;
	// 	}
	// },

	// updateUser: async (clientId: string, values: UserUpdateRequest) => {
	// 	set({ status: 'checking' });

	// 	try {
	// 		const response = await updateUserAction(clientId, values);

	// 		console.log('response guardando la data', JSON.stringify(response, null, 2));

	// 		set({
	// 			user: {
	// 				userId: response.id,
	// 				...response,
	// 			},
	// 		});

	// 		return response;
	// 	} catch (error) {
	// 		console.error('🚨 Error en registro:', error);
	// 	}
	// },

	signOut: async () => {
		await SecureStore.deleteItemAsync('token');
		await SecureStore.deleteItemAsync('user');

		set({ status: 'UNAUTHENTICATE', token: undefined, user: undefined });

		router.replace('/auth/sign-in');

		// await SecureStorageAdapter.deleteItem('hasSeenOnboarding');
	},
}));
