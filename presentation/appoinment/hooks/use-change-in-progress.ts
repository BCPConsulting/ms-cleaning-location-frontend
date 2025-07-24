import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { changeInProgressAction } from '@/core/appointment/actions';

export const useChangeInProgress = () => {
	const { toastError, toastSuccess } = useToast();
	const queryClient = useQueryClient();

	const ChangeInProgress = useMutation({
		mutationFn: changeInProgressAction,
		onSuccess: (response) => {
			toastSuccess(response.message);
			queryClient.invalidateQueries({ queryKey: ['list-assignments-cleaner'] });
		},

		onError: (error) => {
			toastError(error.message);
		},
	});

	return {
		ChangeInProgress,
		isPending: ChangeInProgress.isPending,
	};
};
