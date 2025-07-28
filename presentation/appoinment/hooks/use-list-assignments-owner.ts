import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { getAssignmentsOwnerAction } from '@/core/appointment/actions';
import { FilterAssignmentAdminRequest } from '@/core/appointment/interfaces';
import { formatDateToEndOfDay, formatDateToStartOfDay } from '@/utils/format-start-end-date';

export const useListAssignmentsOwner = (values: FilterAssignmentAdminRequest) => {
	const { toastError, toastSuccess } = useToast();

	const formattedValues = {
		...values,
		from: formatDateToStartOfDay(values.from as Date),
		to: formatDateToEndOfDay(values.to as Date),
	};

	const ListAssignmentsOwner = useQuery({
		queryKey: [
			'list-assignments-owner', 
			values.from, 
			values.to, 
			values.cleanerId, 
			values.paymentType,
			values.pageNumber,
			values.pageSize
		],
		queryFn: () => getAssignmentsOwnerAction(formattedValues),
	});

	return {
		ListAssignmentsOwner,
		isPending: ListAssignmentsOwner.isPending,
	};
};
