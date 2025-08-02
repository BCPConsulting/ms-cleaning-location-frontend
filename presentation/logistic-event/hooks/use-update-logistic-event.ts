import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { updateLogisticEventAction } from '@/core/logistic-event/actions';

export const useUpdateLogistic = () => {
	const { toastError, toastSuccess } = useToast();
	const queryClient = useQueryClient();

	const UpdateLogistic = useMutation({
		mutationFn: updateLogisticEventAction,
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: ['list-deliverys-filter'] });
			queryClient.invalidateQueries({ queryKey: ['list-delivery'] });
			toastSuccess(response.message);
		},

		onError: (error) => {
			toastError(error.message);
		},
	});

	return {
		UpdateLogistic,
		isPending: UpdateLogistic.isPending,
	};
};
