import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { getAssignmentsCleanerAction } from '@/core/appointment/actions';
import { FilterAssignmentAdminRequest } from '@/core/appointment/interfaces';
import { formatDateToEndOfDay, formatDateToStartOfDay } from '@/utils/format-start-end-date';

export const useListAssignmentsCleaner = (values: FilterAssignmentAdminRequest) => {
	console.log('Llamanado de nuevo al hook');

	const formattedValues = {
		...values,
		from: formatDateToStartOfDay(values.from as Date),
		to: formatDateToEndOfDay(values.to as Date),
	};

	const ListAssignmentsCleaner = useQuery({
		queryKey: ['list-assignments-cleaner', values.from, values.to],
		queryFn: () => getAssignmentsCleanerAction(formattedValues),
		refetchOnMount: true,
	});

	return {
		ListAssignmentsCleaner,
		isPending: ListAssignmentsCleaner.isPending,
	};
};
