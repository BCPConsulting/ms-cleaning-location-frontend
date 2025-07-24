import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { changeCompletedAction } from '@/core/appointment/actions';
import { router } from 'expo-router';

export const useChangeCompleted = () => {
	const { toastError, toastSuccess } = useToast();
	const queryClient = useQueryClient();

	const ChangeCompleted = useMutation({
		mutationFn: changeCompletedAction,
		onSuccess: (response) => {
			toastSuccess(response.message);
			queryClient.invalidateQueries({ queryKey: ['list-assignments-cleaner'] });
			router.back();
		},

		onError: (error) => {
			toastError(error.message);
		},
	});

	return {
		ChangeCompleted,
		isPending: ChangeCompleted.isPending,
	};
};
