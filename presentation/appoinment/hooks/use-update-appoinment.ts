import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { updateAppoinmentAction } from '@/core/appointment/actions';

export const useUpdateAppoinment = () => {
	const { toastError, toastSuccess } = useToast();
	const queryClient = useQueryClient();

	const UpdateAppoinment = useMutation({
		mutationFn: updateAppoinmentAction,
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: ['list-assignments-admin'] });
			toastSuccess(response.message);
		},

		onError: (error) => {
			toastError(error.message);
		},
	});

	return {
		UpdateAppoinment,
		isPending: UpdateAppoinment.isPending,
	};
};
