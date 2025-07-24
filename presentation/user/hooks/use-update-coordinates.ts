import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { updateCoordinatesAction } from '@/core/user/actions';

export const useUpdateCoordinates = () => {
	const { toastError, toastSuccess } = useToast();

	const UpdateCoordinates = useMutation({
		mutationFn: updateCoordinatesAction,
		onSuccess: (response) => {
			toastSuccess(response.message);
		},

		onError: (error) => {
			toastError(error.message);
		},
	});

	return {
		UpdateCoordinates,
		isPending: UpdateCoordinates.isPending,
	};
};
