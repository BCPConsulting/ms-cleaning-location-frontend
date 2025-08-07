import { useQuery } from '@tanstack/react-query';
import { getDeliveriesByFilter } from '@/core/delivery/actions';
import { FilterDelivery } from '@/core/delivery/interfaces';

export const useListDeliveryFilter = (values: FilterDelivery) => {
	console.log('1. Render');

	const ListDeliveriesFilter = useQuery({
		queryKey: [
			'list-deliverys-filter',
			values.paymentType,
			values.status,
			values.pageSize,
			values.pageNumber,
			values.clientName,
			values.eventType,
			values.assignmentStatus,
			values.cleanerId,
		],
		queryFn: () => getDeliveriesByFilter(values),
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});

	return {
		ListDeliveriesFilter,
		isPending: ListDeliveriesFilter.isPending,
	};
};
