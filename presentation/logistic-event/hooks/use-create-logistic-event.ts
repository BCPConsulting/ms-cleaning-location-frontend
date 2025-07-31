import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { createLogisticEventAction } from '@/core/logistic-event/actions';

export const useCreateLogistic = () => {
	const { toastError, toastSuccess } = useToast();

	const CreateLogistic = useMutation({
		mutationFn: createLogisticEventAction,
		onSuccess: (response) => {
			toastSuccess('Servicio creado correctamente');
		},

		onError: (error) => {
			toastError(error.message);
		},
	});

	return {
		CreateLogistic,
		isPending: CreateLogistic.isPending,
	};
};
