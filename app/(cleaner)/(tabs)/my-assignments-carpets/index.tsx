import { useCallback, useMemo, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { router } from 'expo-router';
import { CustomText, weight } from '@/components/ui/custom-text';
import { Screen } from '@/components/ui/screen';
import Button from '@/components/ui/button';
import { useAuthStore } from '@/presentation/auth/store/use-auth-store';
import { useUpdateCoordinates } from '@/presentation/user/hooks/use-update-coordinates';
import { useGetCurrentLocation } from '@/presentation/user/hooks/use-get-current-location';
import { useListDeliveryFilter } from '@/presentation/delivery/hooks/use-list-delivery-filter';
import { Delivery } from '@/core/delivery/interfaces';

//!![FIXED]: Obtener las coordenadas con una precision exacta
//! [FIXED]: Falta agregar loaders para mejorar la experiencia de usuario

export default function MyAssigmenetScreen() {
	const { user } = useAuthStore();
	const [refreshing, setRefreshing] = useState(false);
	const { ListDeliveriesFilter } = useListDeliveryFilter({
		pageNumber: 1,
		pageSize: 10,
		cleanerId: user?.id?.toString() ?? '',
		status: 'ACTIVE',
	});
	const { UpdateCoordinates } = useUpdateCoordinates();
	const { GetCurrentLocation } = useGetCurrentLocation();

	const transformedDeliveries = useMemo(() => {
		if (!ListDeliveriesFilter.data?.data) return [];

		return ListDeliveriesFilter.data.data.map((delivery) => ({
			...delivery,
			id: delivery.deliveryId,
		}));
	}, [ListDeliveriesFilter.data?.data]);

	const keyExtractor = useCallback((item: { id: number }) => item.id.toString(), []);

	console.log('ListDeliveriesFilter', JSON.stringify(ListDeliveriesFilter.data?.data, null, 2));

	const renderItem = useCallback(({ item }: { item: Delivery }) => {
		return (
			<>
				<View className='w-full'>
					<View className='p-4 bg-neutral-800 rounded-xl'>
						<View className='flex-row items-center justify-between'>
							<CustomText className='text-neutral-200'>#{item.id}</CustomText>

							<View
								className={`${
									item.cleaningStatus === 'PENDING' ? 'bg-warning/10' : 'bg-secondary/20'
								} rounded-3xl px-3 py-2 self-start`}>
								<CustomText
									className={`text-sm ${item.cleaningStatus === 'PENDING' ? 'text-warning' : 'text-secondary'}`}
									variantWeight={weight.Medium}>
									{item.cleaningStatus === 'PENDING'
										? 'Pendiente'
										: item.cleaningStatus === 'IN_PROGRESS' && 'En Progreso'}
								</CustomText>
							</View>
						</View>

						<View className='mb-3'>
							<CustomText className='text-neutral-400 text-sm'>Nombre cliente:</CustomText>
							<CustomText className='text-neutral-100'>{item.clientName}</CustomText>
						</View>

						<Button
							text='Ver detalles'
							onPress={() =>
								router.push({
									pathname: '/(cleaner)/(tabs)/my-assignments-carpets/appoinment-cleaner',
									params: {
										id: item.id,
									},
								})
							}
						/>
					</View>
				</View>
			</>
		);
	}, []);

	const handleGetMyCurrentCoordinates = async () => {
		GetCurrentLocation.mutate(
			{},
			{
				onSuccess: (response) => {
					UpdateCoordinates.mutate(`${response.coords.latitude},${response.coords.longitude}`);
				},
				onError: (error) => {
					console.log('error', JSON.stringify(error, null, 2));
				},
			}
		);
	};

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		ListDeliveriesFilter.refetch();
		setRefreshing(false);
	}, []);

	return (
		<Screen>
			<View className='flex-1 px-4'>
				<View className='flex-1'>
					<FlatList
						data={transformedDeliveries ?? []}
						ItemSeparatorComponent={() => <View className='h-4' />}
						keyExtractor={keyExtractor}
						refreshControl={
							<RefreshControl
								refreshing={refreshing}
								onRefresh={onRefresh}
							/>
						}
						ListHeaderComponent={() => {
							return (
								<View>
									<CustomText
										variantWeight={weight.SemiBold}
										className='text-2xl mb-4 text-neutral-100'>
										Mis Asignaciones
									</CustomText>

									<View className='mb-3'>
										<Button
											text='Compartir ubicación'
											onPress={() => handleGetMyCurrentCoordinates()}
											disabled={UpdateCoordinates.isPending || GetCurrentLocation.isPending}
											isLoading={UpdateCoordinates.isPending || GetCurrentLocation.isPending}
										/>
									</View>
								</View>
							);
						}}
						renderItem={renderItem}
					/>
				</View>
			</View>
		</Screen>
	);
}
