import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { deleteUserAction } from '@/core/user/actions';

export const useDeleteUser = () => {
	const { toastError, toastSuccess } = useToast();
	const queryClient = useQueryClient();

	const DeleteUser = useMutation({
		mutationFn: deleteUserAction,
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: ['get-all-cleaners'] });
			toastSuccess(response.message);
		},

		onError: (error) => {
			toastError(error.message);
		},
	});

	return {
		DeleteUser,
		isPending: DeleteUser.isPending,
	};
};
