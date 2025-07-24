import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { getAssignmentsAdminAction } from '@/core/appointment/actions';
import { FilterAssignmentAdminRequest } from '@/core/appointment/interfaces';
import { formatDateToEndOfDay, formatDateToStartOfDay } from '@/utils/format-start-end-date';

export const useListAssignmentsAdmin = (values: FilterAssignmentAdminRequest) => {
	const { toastError, toastSuccess } = useToast();

	const formattedValues = {
		...values,
		from: formatDateToStartOfDay(values.from as Date),
		to: formatDateToEndOfDay(values.to as Date),
	};

	const ListAssignmentsAdmin = useQuery({
		queryKey: ['list-assignments-admin', values.from, values.to],
		queryFn: () => getAssignmentsAdminAction(formattedValues),
	});

	return {
		ListAssignmentsAdmin,
		isPending: ListAssignmentsAdmin.isPending,
	};
};
