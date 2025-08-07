import { useCallback, useState } from 'react';
import { FlatList, Pressable, View, RefreshControl } from 'react-native';
import { CustomText, weight } from '@/components/ui/custom-text';
import { router } from 'expo-router';
import { Screen } from '@/components/ui/screen';
import {
	Actionsheet,
	ActionsheetContent,
	ActionsheetDragIndicator,
	ActionsheetDragIndicatorWrapper,
	ActionsheetBackdrop,
} from '@/components/ui/actionsheet';
import { useListAssignmentsAdmin } from '@/presentation/appoinment/hooks/use-list-assignments-admin';
import CalendarWheel from '@/components/ui/calendar-wheel';
import { useDisclose } from '@/hooks/use-disclose';
import { Ionicons } from '@expo/vector-icons';
import { AssignmentAdminResponse } from '@/core/appointment/interfaces';
import { formatISOToDate } from '@/utils/format-iso-to-date';
import { useGetAllCleaners } from '@/presentation/user/hooks/use-get-all-cleaners';
import { useAssignmentCleaner } from '@/presentation/appoinment/hooks/use-assignment-cleaner';
import Button from '@/components/ui/button';

//! [FIXED]: Falta agregar loaders para mejorar la experiencia de usuario

export default function Assignments() {
	const [timeStart, setTimeStart] = useState<Date>(new Date());
	const [timeEnd, setTimeEnd] = useState<Date>(new Date());
	const [refreshing, setRefreshing] = useState(false);
	const [isOpen, onOpen, onClose] = useDisclose();
	const [currentEditingTimeType, setCurrentEditingTimeType] = useState<'start' | 'end'>('start');
	const { ListAssignmentsAdmin } = useListAssignmentsAdmin({ from: timeStart, to: timeEnd, pageNumber: 1, pageSize: 10 });
	const { AssignmentCleaner } = useAssignmentCleaner();
	const { GetCleaners } = useGetAllCleaners();

	console.log('ListAssignmentsAdmins', JSON.stringify(ListAssignmentsAdmin.data?.data, null, 2));

	const handlePresentModalPress = useCallback((timeType: 'start' | 'end') => {
		onOpen();
		setCurrentEditingTimeType(timeType);
	}, []);

	const keyExtractor = useCallback((item: { id: number }) => item.id.toString(), []);

	const renderItem = useCallback(
		({ item }: { item: AssignmentAdminResponse }) => {
			return (
				<View className='w-full flex-1'>
					<View className='p-4 bg-neutral-800 rounded-xl'>
						<View className='flex-row items-center justify-between'>
							<CustomText className='text-neutral-200'>#{item.id}</CustomText>

							<View
								className={`${
									item.cleaningStatus === 'PENDING'
										? 'bg-warning/10'
										: item.cleaningStatus === 'IN_PROGRESS'
										? 'bg-secondary/20'
										: 'bg-primary/20'
								} rounded-3xl px-3 py-2 self-start`}>
								<CustomText
									className={`text-sm ${
										item.cleaningStatus === 'PENDING'
											? 'text-warning'
											: item.cleaningStatus === 'IN_PROGRESS'
											? 'text-secondary'
											: 'text-primary'
									}`}
									variantWeight={weight.Medium}>
									{item.cleaningStatus === 'PENDING'
										? 'Pendiente'
										: item.cleaningStatus === 'IN_PROGRESS'
										? 'En Progreso'
										: 'Completado'}
								</CustomText>
							</View>
						</View>

						{!item.cleaningStatus && (
							<View>
								<CustomText>{'Falta asignar un operario'}</CustomText>
							</View>
						)}

						<View className='mb-3'>
							<CustomText className='text-neutral-400 text-sm'>Nombre cliente:</CustomText>
							<CustomText className='text-neutral-100'>{item.clientName}</CustomText>
						</View>

						<View className='mb-3'>
							<CustomText className='text-neutral-400 text-sm'>Número:</CustomText>
							<CustomText className='text-neutral-100'>{item.phone}</CustomText>
						</View>

						<View className='mb-3'>
							<CustomText className='text-neutral-400 text-sm'>Detalles:</CustomText>
							<CustomText className='text-neutral-100'>{item.detail}</CustomText>
						</View>

						<View className='mb-3'>
							<CustomText className='text-neutral-400 text-sm'>Fecha:</CustomText>
							<CustomText className='text-neutral-100'>{formatISOToDate(item.dateTime, true)}</CustomText>
						</View>

						<Button
							text='Editar'
							onPress={() =>
								router.push({
									pathname: '/(admin)/(tabs)/assignments/appoinment-admin',
									params: {
										id: item.id,
										dateTime: item.dateTime.toString(),
										assignmentStatus: item.assignmentStatus,
										cleanerId: item.cleanner?.id,
										detail: item.detail,
										price: item.price,
										cleaningStatus: item.cleaningStatus,
										clientName: item.clientName,
										locationReference: item.locationReference,
										locationName: item.locationName,
										coordinates: item.coordinates,
										phone: item.phone,
									},
								})
							}
						/>
					</View>
				</View>
			);
		},
		[GetCleaners.data?.data, ListAssignmentsAdmin.data?.data, AssignmentCleaner]
	);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		ListAssignmentsAdmin.refetch();
		setRefreshing(false);
	}, []);

	return (
		<Screen>
			<View className='flex-1 px-4'>
				<FlatList
					data={ListAssignmentsAdmin.data?.data ?? []}
					ItemSeparatorComponent={() => <View className='h-4' />}
					keyExtractor={keyExtractor}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
						/>
					}
					ListHeaderComponent={
						<>
							{/* <View className='mb-4'>
								<CustomText className='text-2xl text-neutral-100'>Lista de asignaciones</CustomText>
							</View> */}

							<View className='mb-4 flex-row gap-4'>
								<View className='flex-1'>
									<CustomText className='text-neutral-400 mb-2'>Inicio</CustomText>
									<Pressable
										className='flex-row items-center gap-3 flex-1'
										style={{
											paddingHorizontal: 24,
											paddingVertical: 12,
											borderRadius: 12,
											justifyContent: 'center',
											alignItems: 'center',
											backgroundColor: '#262626',
											borderWidth: 1,
											borderColor: '#404040',
										}}
										onPress={() => handlePresentModalPress('start')}>
										<Ionicons
											name='calendar-outline'
											size={20}
											color='#d4d4d4'
										/>
										<View className='flex-row items-cemter flex-1'>
											<CustomText
												variantWeight={weight.Medium}
												className='text-neutral-300 text-sm'>
												{formatISOToDate(timeStart)}
											</CustomText>
										</View>
									</Pressable>
								</View>

								<View className='flex-1'>
									<CustomText className='text-neutral-400 mb-2'>Fin</CustomText>
									<Pressable
										className='flex-row items-center gap-3'
										style={{
											paddingHorizontal: 24,
											paddingVertical: 12,
											borderRadius: 12,
											justifyContent: 'center',
											alignItems: 'center',
											backgroundColor: '#262626',
											borderWidth: 1,
											borderColor: '#404040',
										}}
										onPress={() => handlePresentModalPress('end')}>
										<Ionicons
											name='calendar-outline'
											size={20}
											color='#d4d4d4'
										/>
										<View className='flex-row items-cemter'>
											<CustomText
												variantWeight={weight.Medium}
												className='text-neutral-300 text-sm'>
												{formatISOToDate(timeEnd)}
											</CustomText>
										</View>
									</Pressable>
								</View>
							</View>

							<Actionsheet
								isOpen={isOpen}
								onClose={onClose}>
								<ActionsheetBackdrop />
								<ActionsheetContent>
									<ActionsheetDragIndicatorWrapper>
										<ActionsheetDragIndicator />
									</ActionsheetDragIndicatorWrapper>
									<View className='py-4'>
										<CalendarWheel
											title='Selecciona una fecha'
											onSubmit={(value) => {
												if (currentEditingTimeType === 'start') {
													setTimeStart(value.date);
												} else {
													setTimeEnd(value.date);
												}

												onClose();
											}}
										/>
									</View>
								</ActionsheetContent>
							</Actionsheet>
						</>
					}
					renderItem={renderItem}
				/>
			</View>
		</Screen>
	);
}
