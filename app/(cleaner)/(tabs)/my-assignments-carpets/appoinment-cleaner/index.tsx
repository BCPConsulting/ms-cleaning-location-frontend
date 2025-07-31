import { useState } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Button from '@/components/ui/button';
import ButtonBack from '@/components/ui/button-back';
import { CustomText, weight } from '@/components/ui/custom-text';
import { Screen } from '@/components/ui/screen';
import { CleaningStatus, PaymentType } from '@/core/shared/interfaces';
import {
	Select,
	SelectTrigger,
	SelectInput,
	SelectIcon,
	SelectPortal,
	SelectBackdrop,
	SelectContent,
	SelectDragIndicator,
	SelectDragIndicatorWrapper,
	SelectItem,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ChevronDownIcon } from '@/components/ui/icon';
import { useUpdateDelivery } from '@/presentation/delivery/hooks/use-update-delivery';
import { useGetDelivery } from '@/presentation/delivery/hooks/use-get-delivery';
import { Spinner } from '@/components/ui/spinner';

export default function AssignmentIdCleaner() {
	const { id } = useLocalSearchParams();
	const { toastError } = useToast();
	const [paymentType, setPaymentType] = useState<PaymentType | null>(null);
	const { GetDelivery } = useGetDelivery(+id);
	const { UpdateDelivery } = useUpdateDelivery();

	const delivery = GetDelivery.data?.data;

	const handleChangeCleaningStatus = async (cleaningStatus: CleaningStatus, deliveryId: number) => {
		if (!delivery) {
			return;
		}

		if (cleaningStatus === 'PENDING') {
			UpdateDelivery.mutate({
				deliveryId: delivery.id,
				cleaningStatus: 'IN_PROGRESS',
				price: `${delivery?.price}`,
				clientName: delivery?.clientName,
				paymentType: delivery?.paymentType,
				status: delivery.status,
			});
			return;
		}

		if (cleaningStatus === 'IN_PROGRESS') {
			if (!paymentType) {
				toastError('Falta elegir el tipo de pago');
				return;
			}

			UpdateDelivery.mutateAsync(
				{
					deliveryId: delivery.id,
					cleaningStatus: 'COMPLETED',
					price: `${delivery?.price}`,
					clientName: delivery?.clientName,
					paymentType: delivery?.paymentType,
					status: delivery.status,
				},
				{
					onSuccess: () => {
						router.back();
					},
				}
			);

			return;
		}
	};

	if (GetDelivery.isPending || GetDelivery.isLoading || !delivery) {
		return (
			<Screen>
				<View className='flex-1 justify-center items-center'>
					<Spinner size='large' />
				</View>
			</Screen>
		);
	}

	return (
		<Screen>
			<View className='flex-1 px-4'>
				<View className='flex-row items-center mb-4'>
					<ButtonBack />
					<CustomText
						className='text-2xl px-4 text-neutral-100'
						variantWeight={weight.SemiBold}>
						Detalles del servicio
					</CustomText>
				</View>

				<View className='flex-row items-center justify-between mb-5'>
					<View
						className={`${
							delivery?.cleaningStatus === 'PENDING' ? 'bg-warning/10' : 'bg-secondary/20'
						} rounded-3xl px-3 py-2 self-start`}>
						<CustomText
							className={`text-sm ${delivery?.cleaningStatus === 'PENDING' ? 'text-warning' : 'text-secondary'}`}
							variantWeight={weight.Medium}>
							{delivery?.cleaningStatus === 'PENDING'
								? 'Pendiente'
								: delivery?.cleaningStatus === 'IN_PROGRESS' && 'En Progreso'}
						</CustomText>
					</View>
				</View>

				<View className='mb-3'>
					<CustomText className='text-neutral-400 text-sm'>Nombre Cliente:</CustomText>
					<CustomText className='text-neutral-100'>{delivery?.clientName}</CustomText>
				</View>

				<View className='mb-3'>
					<Select onValueChange={(value) => setPaymentType(value as PaymentType)}>
						<SelectTrigger
							style={{ borderWidth: 0, backgroundColor: '#262626', borderRadius: 12 }}
							className='justify-between'
							size='md'>
							<SelectInput
								placeholder='Elegir metodo de pago'
								placeholderTextColor={'#8c8c90'}
							/>
							<SelectIcon
								className='mr-3'
								as={ChevronDownIcon}
							/>
						</SelectTrigger>
						<SelectPortal>
							<SelectBackdrop />
							<SelectContent>
								<SelectDragIndicatorWrapper>
									<SelectDragIndicator />
								</SelectDragIndicatorWrapper>
								<SelectItem
									label='Yape'
									value='YAPE'
								/>
								<SelectItem
									label='Plin'
									value='PLIN'
								/>
								<SelectItem
									label='Transferencia'
									value='TRANSFER'
								/>
								<SelectItem
									label='Efectivo'
									value='CASH'
								/>
							</SelectContent>
						</SelectPortal>
					</Select>
				</View>

				<Button
					text={
						delivery?.cleaningStatus === 'PENDING'
							? 'Actualizar Estado'
							: delivery?.cleaningStatus === 'IN_PROGRESS'
							? 'Terminar'
							: 'Actualizar Estado'
					}
					onPress={() => handleChangeCleaningStatus(delivery?.cleaningStatus as CleaningStatus, +id)}
					isLoading={UpdateDelivery.isPending || UpdateDelivery.isPending}
					disabled={UpdateDelivery.isPending || UpdateDelivery.isPending}
				/>
			</View>
		</Screen>
	);
}
