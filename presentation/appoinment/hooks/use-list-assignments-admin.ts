import { useQuery } from '@tanstack/react-query';
import { getAssignmentsAdminAction, getAssignmentsOwnerAction } from '@/core/appointment/actions';
import { FilterAssignmentAdminRequest } from '@/core/appointment/interfaces';
import { formatDateToEndOfDay, formatDateToStartOfDay } from '@/utils/format-start-end-date';
import { useAuthStore } from '@/presentation/auth/store/use-auth-store';

export const useListAssignmentsAdmin = (values: FilterAssignmentAdminRequest) => {
	const { user } = useAuthStore();

	const formattedValues = {
		...values,
		from: formatDateToStartOfDay(values.from as Date),
		to: formatDateToEndOfDay(values.to as Date),
	};

	const ListAssignmentsAdmin = useQuery({
		queryKey: ['list-assignments-admin', values.from, values.to],
		queryFn: () => {
			if (user.role === 'ADMIN') {
				return getAssignmentsAdminAction(formattedValues);
			} else {
				console.log('Consumiendo getAssignmentsOwnerAction');
				return getAssignmentsOwnerAction(formattedValues);
			}
		},
		refetchOnMount: true,
	});

	return {
		ListAssignmentsAdmin,
		isPending: ListAssignmentsAdmin.isPending,
	};
};
