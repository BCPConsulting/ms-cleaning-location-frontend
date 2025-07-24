import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import * as Location from 'expo-location';

export const useGetCurrentLocation = () => {
	const { toastError, toastSuccess } = useToast();

	const GetCurrentLocation = useMutation({
		mutationFn: Location.getCurrentPositionAsync,
		// onSuccess: (response) => {
		// 	console.log('Response', JSON.stringify(response, null, 2));
		// 	toastSuccess('Se Obtuvo las coordenadas');
		// },

		// onError: (error) => {
		// 	toastError(error.message);
		// },
	});

	return {
		GetCurrentLocation,
		isPending: GetCurrentLocation.isPending,
	};
};
