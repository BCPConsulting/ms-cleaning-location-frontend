import { signInAction } from '@/core/auth/actions';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useAuthStore } from '../store/use-auth-store';
import { useToast } from '@/hooks/use-toast';

export const useSignIn = () => {
	const { changeStatus } = useAuthStore();
	const { toastError } = useToast();

	const SignIn = useMutation({
		mutationFn: signInAction,
		onSuccess: (response) => {
			const { data } = response;

			changeStatus(data.token, data);

			if (data.role === 'ADMIN' || data.role === 'OWNER') {
				router.replace('/(admin)/(tabs)/user');
			} else if (data.role === 'CLEANER') {
				router.replace('/(cleaner)/(tabs)/user');
			} else {
				router.replace('/auth/sign-in');
			}
		},

		onError: (error) => {
			console.log('error', JSON.stringify(error, null, 2));
			toastError(error.message);
		},
	});

	return {
		SignIn,
		isPending: SignIn.isPending,
	};
};
