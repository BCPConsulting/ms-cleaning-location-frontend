import { useQuery } from '@tanstack/react-query';
import { getDeliveries } from '@/core/delivery/actions';

export const useListDelivery = () => {
	const ListDeliveries = useQuery({
		queryKey: ['list-deliverys'],
		queryFn: () => getDeliveries(),
		refetchOnMount: true,
	});

	return {
		ListDeliveries,
		isPending: ListDeliveries.isPending,
	};
};
