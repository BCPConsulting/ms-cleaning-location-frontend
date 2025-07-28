import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { deleteAppointmentAction } from '@/core/appointment/actions';
import { router } from 'expo-router';

export const useDeleteAppointment = () => {
	const { toastError, toastSuccess } = useToast();

	const queryClient = useQueryClient();

	const DeleteAppointment = useMutation({
		mutationFn: deleteAppointmentAction,
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: ['list-assignments-admin'] });
			toastSuccess(response.message);
			router.back();
		},

		onError: (error) => {
			toastError(error.message);
		},
	});

	return {
		DeleteAppointment,
		isPending: DeleteAppointment.isPending,
	};
};
