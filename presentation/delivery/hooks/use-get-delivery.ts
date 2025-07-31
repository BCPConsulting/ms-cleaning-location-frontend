import { useQuery } from '@tanstack/react-query';
import { getDelivery } from '@/core/delivery/actions';

export const useGetDelivery = (deliveryId: number) => {
	const GetDelivery = useQuery({
		queryKey: ['list-delivery', deliveryId],
		queryFn: () => getDelivery(deliveryId),
		refetchOnMount: true,
	});

	return {
		GetDelivery,
		isPending: GetDelivery.isPending,
	};
};
