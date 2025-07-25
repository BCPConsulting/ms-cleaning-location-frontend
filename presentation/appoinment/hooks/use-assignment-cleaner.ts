import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { assignmentCleanerAction } from '@/core/appointment/actions';

export const useAssignmentCleaner = () => {
	const { toastError, toastSuccess } = useToast();

	const AssignmentCleaner = useMutation({
		mutationFn: assignmentCleanerAction,
		onSuccess: (response) => {
			toastSuccess(response.message);
		},

		onError: (error) => {
			toastError(error.message);
		},
	});

	return {
		AssignmentCleaner,
		isPending: AssignmentCleaner.isPending,
	};
};
