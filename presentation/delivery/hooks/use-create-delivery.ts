import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { createDeliveryAction } from '@/core/delivery/actions';

export const useCreateDelivery = () => {
	const { toastError, toastSuccess } = useToast();
	const queryClient = useQueryClient();

	const CreateDelivery = useMutation({
		mutationFn: createDeliveryAction,
		onSuccess: (response) => {
			console.log('1. Onsucess');
			toastSuccess('Servicio creado correctamente');

			queryClient.invalidateQueries({ queryKey: ['list-deliverys'] });
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
