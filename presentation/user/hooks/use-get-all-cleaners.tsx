import { getAllCleanersAction } from '@/core/user/actions';
import { useQuery } from '@tanstack/react-query';

export const useGetAllCleaners = () => {
	const GetCleaners = useQuery({
		queryKey: ['get-all-cleaners'],
		queryFn: getAllCleanersAction,
		refetchOnMount: true,
	});

	return {
		GetCleaners,
		isPending: GetCleaners.isLoading,
	};
};
