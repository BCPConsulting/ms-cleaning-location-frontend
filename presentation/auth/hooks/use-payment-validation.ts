import { paymentValidationAction } from '@/core/auth/actions';
import { useQuery } from '@tanstack/react-query';

export const usePaymentValidation = () => {
	const paymentValidation = useQuery({
		queryKey: ['payment-validation'],
		queryFn: async () => {
			const result = await paymentValidationAction();
			return result;
		},
	});

	return {
		paymentValidation,
	};
};
