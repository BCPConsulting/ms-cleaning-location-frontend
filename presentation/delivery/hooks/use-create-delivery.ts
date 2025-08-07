import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { createDeliveryAction } from '@/core/delivery/actions';

export const useCreateDelivery = () => {
	const { toastError, toastSuccess } = useToast();
	const queryClient = useQueryClient();

	const CreateDelivery = useMutation({
		mutationFn: createDeliveryAction,
		onSuccess: (response) => {
			toastSuccess('Servicio creado correctamente');
			queryClient.invalidateQueries({ queryKey: ['list-deliverys-filter'] });
		},

		onError: (error) => {
			toastError(error.message);
		},
	});

	return {
		CreateDelivery,
		isPending: CreateDelivery.isPending,
	};
};
