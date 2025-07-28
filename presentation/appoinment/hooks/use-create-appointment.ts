import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { createAppointmentAction } from '@/core/appointment/actions';
import { useAuthStore } from '@/presentation/auth/store/use-auth-store';

export const useCreateAppointment = () => {
	const { user } = useAuthStore();
	const { toastError, toastSuccess } = useToast();
	const queryClient = useQueryClient();

	const CreateAppointment = useMutation({
		mutationFn: createAppointmentAction,
		onSuccess: (response) => {
			toastSuccess('Servicio creado correctamente');
			if (user.role === 'OWNER') {
				queryClient.invalidateQueries({ queryKey: ['list-assignments-owner'] });
				return;
			}

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
