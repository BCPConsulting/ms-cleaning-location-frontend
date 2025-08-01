import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { updateUserAction } from '@/core/user/actions';

export const useUpdateUser = () => {
	const { toastError, toastSuccess } = useToast();
	const queryClient = useQueryClient();

	const UpdateUser = useMutation({
		mutationFn: updateUserAction,
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: ['get-all-cleaners'] });
			toastSuccess(response.message);
		},

		onError: (error) => {
			toastError(error.message);
		},
	});

	return {
		UpdateUser,
		isPending: UpdateUser.isPending,
	};
};
