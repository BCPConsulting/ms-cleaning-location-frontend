import { useQuery } from '@tanstack/react-query';
import { getDeliveries, getDeliveriesByFilter, getDeliveriesCleanerByFilter } from '@/core/delivery/actions';
import { FilterDelivery } from '@/core/delivery/interfaces';

export const useListDeliveryCleanerFilter = (values: FilterDelivery) => {
	const listDeliveryCleanerFilter = useQuery({
		queryKey: [
			'list-deliverys-cleaner-filter',
			values.paymentType,
			values.status,
			values.pageSize,
			values.pageNumber,
			values.clientName,
			values.eventType,
			values.assignmentStatus,
		],
		queryFn: () => getDeliveriesCleanerByFilter(values),
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});

	return {
		listDeliveryCleanerFilter,
		isPending: listDeliveryCleanerFilter.isPending,
	};
};
