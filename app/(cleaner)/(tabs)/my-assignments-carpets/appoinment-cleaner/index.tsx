import { ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Button from '@/components/ui/button';
import ButtonBack from '@/components/ui/button-back';
import { CustomText, weight } from '@/components/ui/custom-text';
import { Screen } from '@/components/ui/screen';
import { useUpdateDelivery } from '@/presentation/delivery/hooks/use-update-delivery';
import { useGetDelivery } from '@/presentation/delivery/hooks/use-get-delivery';
import { Spinner } from '@/components/ui/spinner';
import { useAuthStore } from '@/presentation/auth/store/use-auth-store';
import { useUpdateLogistic } from '@/presentation/logistic-event/hooks/use-update-logistic-event';
import { useListDeliveryCleanerFilter } from '@/presentation/delivery/hooks/use-list-delivery-filter copy';

export function formatISOToDisplayDate(isoString: string): string {
	if (!isoString || isoString.trim() === '') {
		return '';
	}

	try {
		const date = new Date(isoString);

		if (isNaN(date.getTime())) {
			throw new Error('Invalid ISO date');
		}

		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const year = date.getFullYear();
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');

		return `${day}/${month}/${year} ${hours}:${minutes}`;
	} catch (error) {
		console.error('Error converting ISO to display date:', error);
		return '';
	}
}

export default function AssignmentIdCleaner() {
	const { user } = useAuthStore();
	const { id } = useLocalSearchParams();
	// const { GetDelivery } = useGetDelivery(+id);
	const { listDeliveryCleanerFilter } = useListDeliveryCleanerFilter({
		pageNumber: 1,
		pageSize: 10,
		status: 'ACTIVE',
		deliveryId: id as string,
	});
	const { UpdateDelivery } = useUpdateDelivery();
	const { UpdateLogistic } = useUpdateLogistic();

	const delivery = listDeliveryCleanerFilter.data?.data[0];

	const deliveryPickUp = delivery?.logisticEvents?.find(
		(logistic) => logistic.cleanerId === user.id && logistic.eventType === 'PICKUP'
	);

	const deliveryShipping = delivery?.logisticEvents?.find(
		(logistic) => logistic.cleanerId === user.id && logistic.eventType === 'SHIPPING'
	);

	console.log('delivery', JSON.stringify(delivery, null, 2));

	const handleChangeCleaningPickUp = async () => {
		if (deliveryPickUp?.cleaningStatus === 'PENDING') {
			UpdateLogistic.mutate({
				id: deliveryPickUp.id,
				assignmentStatus: deliveryPickUp?.assignmentStatus,
				cleanerId: deliveryPickUp?.cleanerId?.toString(),
				coordinates: deliveryPickUp?.coordinates,
				dateTime: deliveryPickUp?.dateTime,
				deliveryId: deliveryPickUp?.deliveryId?.toString(),
				eventType: deliveryPickUp?.eventType,
				locationName: deliveryPickUp?.locationName,
				locationReference: deliveryPickUp?.locationReference,
				cleaningStatus: 'IN_PROGRESS',
			});
			return;
		}

		if (deliveryPickUp?.cleaningStatus === 'IN_PROGRESS') {
			UpdateLogistic.mutate({
				id: deliveryPickUp.id,
				assignmentStatus: deliveryPickUp?.assignmentStatus,
				cleanerId: deliveryPickUp?.cleanerId?.toString(),
				coordinates: deliveryPickUp?.coordinates,
				dateTime: deliveryPickUp?.dateTime,
				deliveryId: deliveryPickUp?.deliveryId?.toString(),
				eventType: deliveryPickUp?.eventType,
				locationName: deliveryPickUp?.locationName,
				locationReference: deliveryPickUp?.locationReference,
				cleaningStatus: 'COMPLETED',
			});
			return;
		}
	};

	const handleChangeCleaningStatusShipping = async () => {
		if (!delivery) {
			return;
		}

		if (deliveryShipping?.cleaningStatus === 'PENDING') {
			UpdateLogistic.mutate({
				id: deliveryShipping.id,
				assignmentStatus: deliveryShipping?.assignmentStatus,
				cleanerId: deliveryShipping?.cleanerId?.toString(),
				coordinates: deliveryShipping?.coordinates,
				dateTime: deliveryShipping?.dateTime,
				deliveryId: deliveryShipping?.deliveryId?.toString(),
				eventType: deliveryShipping?.eventType,
				locationName: deliveryShipping?.locationName,
				locationReference: deliveryShipping?.locationReference,
				cleaningStatus: 'IN_PROGRESS',
			});
			return;
		}

		if (deliveryShipping?.cleaningStatus === 'IN_PROGRESS') {
			UpdateLogistic.mutate({
				id: deliveryShipping.id,
				assignmentStatus: deliveryShipping?.assignmentStatus,
				cleanerId: deliveryShipping?.cleanerId?.toString(),
				coordinates: deliveryShipping?.coordinates,
				dateTime: deliveryShipping?.dateTime,
				deliveryId: deliveryShipping?.deliveryId?.toString(),
				eventType: deliveryShipping?.eventType,
				locationName: deliveryShipping?.locationName,
				locationReference: deliveryShipping?.locationReference,
				cleaningStatus: 'COMPLETED',
			});

			UpdateDelivery.mutateAsync(
				{
					deliveryId: delivery.deliveryId,
					cleaningStatus: 'COMPLETED',
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

	if (listDeliveryCleanerFilter.isPending || listDeliveryCleanerFilter.isLoading || !delivery) {
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
			<ScrollView className='flex-1 px-4'>
				<View className='flex-row items-center mb-4'>
					<ButtonBack />
					<CustomText
						className='text-2xl px-4 text-neutral-100'
						variantWeight={weight.SemiBold}>
						Detalles del servicio
					</CustomText>
				</View>

				{deliveryPickUp && (
					<View>
						<View className='flex-row items-center gap-3 mb-5'>
							<CustomText className='text-neutral-100'>Recojo</CustomText>
							<View
								className={`${
									deliveryPickUp?.cleaningStatus === 'PENDING' ? 'bg-warning/10' : 'bg-secondary/20'
								} rounded-3xl px-3 py-2 self-start`}>
								<CustomText
									className={`text-sm ${
										deliveryPickUp?.cleaningStatus === 'PENDING' ? 'text-warning' : 'text-secondary'
									}`}
									variantWeight={weight.Medium}>
									{deliveryPickUp?.cleaningStatus === 'PENDING'
										? 'Pendiente'
										: deliveryPickUp?.cleaningStatus === 'IN_PROGRESS' && 'En Progreso'}
								</CustomText>
							</View>
						</View>

						<View className='mb-3'>
							<CustomText className='text-neutral-400 text-sm'>Nombre Cliente:</CustomText>
							<CustomText className='text-neutral-100'>{delivery?.clientName}</CustomText>
						</View>

						<View className='mb-3'>
							<CustomText className='text-neutral-400 text-sm'>Lugar:</CustomText>
							<CustomText className='text-neutral-100'>{deliveryPickUp?.locationName}</CustomText>
						</View>

						<View className='mb-3'>
							<CustomText className='text-neutral-400 text-sm'>Referencia:</CustomText>
							<CustomText className='text-neutral-100'>{deliveryPickUp?.locationReference}</CustomText>
						</View>

						<View className='mb-3'>
							<CustomText className='text-neutral-400 text-sm'>Fecha:</CustomText>
							<CustomText className='text-neutral-100'>{formatISOToDisplayDate(deliveryPickUp?.dateTime)}</CustomText>
						</View>

						<Button
							text={
								deliveryPickUp?.cleaningStatus === 'PENDING'
									? 'Actualizar Estado'
									: deliveryPickUp?.cleaningStatus === 'IN_PROGRESS'
									? 'Terminar'
									: 'Actualizar Estado'
							}
							onPress={() => handleChangeCleaningPickUp()}
							isLoading={UpdateLogistic.isPending || UpdateLogistic.isPending}
							disabled={UpdateLogistic.isPending || UpdateLogistic.isPending}
						/>
					</View>
				)}

				{deliveryShipping && (
					<View>
						<View className='flex-row items-center gap-3 mb-5'>
							<CustomText className='text-neutral-100'>Envio</CustomText>
							<View
								className={`${
									deliveryPickUp?.cleaningStatus === 'PENDING'
										? 'bg-warning/10'
										: deliveryPickUp?.cleaningStatus === 'IN_PROGRESS'
										? 'bg-secondary/20'
										: 'bg-green-600/20'
								} rounded-3xl px-3 py-2 self-start`}>
								<CustomText
									className={`text-sm ${
										deliveryPickUp?.cleaningStatus === 'PENDING'
											? 'text-warning'
											: deliveryPickUp?.cleaningStatus === 'IN_PROGRESS'
											? 'text-secondary'
											: 'text-green-600'
									}`}
									variantWeight={weight.Medium}>
									{deliveryPickUp?.cleaningStatus === 'PENDING' ? 'Pendiente' : 'En Progreso'}
								</CustomText>
							</View>
						</View>

						<View className='mb-3'>
							<CustomText className='text-neutral-400 text-sm'>Nombre Cliente:</CustomText>
							<CustomText className='text-neutral-100'>{delivery?.clientName}</CustomText>
						</View>

						<View className='mb-3'>
							<CustomText className='text-neutral-400 text-sm'>Lugar:</CustomText>
							<CustomText className='text-neutral-100'>{deliveryShipping?.locationName}</CustomText>
						</View>

						<View className='mb-3'>
							<CustomText className='text-neutral-400 text-sm'>Referencia:</CustomText>
							<CustomText className='text-neutral-100'>{deliveryShipping?.locationReference}</CustomText>
						</View>

						<View className='mb-3'>
							<CustomText className='text-neutral-400 text-sm'>Fecha:</CustomText>
							<CustomText className='text-neutral-100'>{formatISOToDisplayDate(deliveryShipping?.dateTime)}</CustomText>
						</View>

						<Button
							text={
								deliveryShipping?.cleaningStatus === 'PENDING'
									? 'Actualizar Estado'
									: deliveryShipping?.cleaningStatus === 'IN_PROGRESS'
									? 'Terminar'
									: 'Actualizar Estado'
							}
							onPress={() => handleChangeCleaningStatusShipping()}
							isLoading={UpdateLogistic.isPending || UpdateLogistic.isPending}
							disabled={UpdateLogistic.isPending || UpdateLogistic.isPending}
						/>
					</View>
				)}
			</ScrollView>
		</Screen>
	);
}
