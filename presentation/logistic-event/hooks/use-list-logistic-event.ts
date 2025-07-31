import { useQuery } from '@tanstack/react-query';
import { getDeliveries } from '@/core/delivery/actions';
import { getAllLogisticEventAction } from '@/core/logistic-event/actions';

export const useListLogisticEvent = () => {
	const ListLogisticEvent = useQuery({
		queryKey: ['list-logistic-event'],
		queryFn: () => getAllLogisticEventAction(),
		refetchOnMount: true,
	});

	return {
		ListLogisticEvent,
		isPending: ListLogisticEvent.isPending,
	};
};
