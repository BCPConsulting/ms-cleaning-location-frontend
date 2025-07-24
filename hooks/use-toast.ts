import CustomToast from '@/components/ui/custom-toast';
import { ToastPosition, toast } from '@backpackapp-io/react-native-toast';
import { ToastAnimationConfig } from '@backpackapp-io/react-native-toast/lib/typescript/core/types';
import { Easing } from 'react-native-reanimated';

export const useToast = () => {
	const animationConfig: ToastAnimationConfig = {
		duration: 500,
		flingPositionReturnDuration: 200,
		easing: Easing.elastic(1),
	};

	const toastSuccess = (message: string) => {
		toast.success(message, {
			duration: 3000,
			position: ToastPosition.TOP,
			customToast: CustomToast,
			animationType: 'timing',
			animationConfig,
		});
	};

	const toastError = (message: string) => {
		toast.error(message, {
			duration: 3000,
			position: ToastPosition.TOP,
			customToast: CustomToast,
			animationType: 'timing',
			animationConfig: animationConfig,
		});
	};

	return {
		toastSuccess,
		toastError,
	};
};
