import { signInAction, signUpAction } from '@/core/auth/actions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export const useSignUp = () => {
	const { toastError, toastSuccess } = useToast();
	const queryClient = useQueryClient();

	const SignUp = useMutation({
		mutationFn: signUpAction,
		onSuccess: (response) => {
			toastSuccess('Se creo correctamente el usuario');
			queryClient.invalidateQueries({ queryKey: ['get-all-cleaners'] });
		},

		onError: (error) => {
			console.log('error', JSON.stringify(error, null, 2));
			toastError(error.message);
		},
	});

	return {
		SignUp,
		isPending: SignUp.isPending,
	};
};
