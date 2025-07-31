import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { createDeliveryAction, updateDeliveryAction } from '@/core/delivery/actions';

export const useUpdateDelivery = () => {
	const { toastError, toastSuccess } = useToast();
	const queryClient = useQueryClient();

	const UpdateDelivery = useMutation({
		mutationFn: updateDeliveryAction,
		onSuccess: (response) => {
			toastSuccess('Servicio actualizado correctamente');
			queryClient.invalidateQueries({ queryKey: ['list-deliverys-filter'] });
			queryClient.invalidateQueries({ queryKey: ['list-delivery'] });
		},

		onError: (error) => {
			toastError(error.message);
		},
	});

	return {
		UpdateDelivery,
		isPending: UpdateDelivery.isPending,
	};
};
