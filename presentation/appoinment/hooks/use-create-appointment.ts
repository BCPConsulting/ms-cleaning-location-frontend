import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { createAppointmentAction } from '@/core/appointment/actions';

export const useCreateAppointment = () => {
	const { toastError, toastSuccess } = useToast();
	const queryClient = useQueryClient();

	const CreateAppointment = useMutation({
		mutationFn: createAppointmentAction,
		onSuccess: (response) => {
			toastSuccess('Servicio creado correctamente');
			queryClient.invalidateQueries({ queryKey: ['list-assignments-admin'] });
		},

		onError: (error) => {
			toastError(error.message);
		},
	});

	return {
		CreateAppointment,
		isPending: CreateAppointment.isPending,
	};
};
