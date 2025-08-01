import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CustomText, weight } from '@/components/ui/custom-text';
import { Screen } from '@/components/ui/screen';
import { Ionicons } from '@expo/vector-icons';
import { formatISOToDate } from '@/utils/format-iso-to-date';
import { useDisclose } from '@/hooks/use-disclose';
import {
	Actionsheet,
	ActionsheetContent,
	ActionsheetDragIndicator,
	ActionsheetDragIndicatorWrapper,
	ActionsheetBackdrop,
} from '@/components/ui/actionsheet';
import CalendarWheel from '@/components/ui/calendar-wheel';
import { useListAssignmentsOwner } from '@/presentation/appoinment/hooks/use-list-assignments-owner';
import { AssignmentAdminResponse } from '@/core/appointment/interfaces';
import { useGetAllCleaners } from '@/presentation/user/hooks/use-get-all-cleaners';
import { paymentTypeReturnData } from '@/utils/payment-type-return-data';
import { PaymentType } from '@/core/shared/interfaces';

export default function ReportScreen() {
	const [timeStart, setTimeStart] = useState<Date>(new Date());
	const [timeEnd, setTimeEnd] = useState<Date>(new Date());
	const [selectedCleanerId, setSelectedCleanerId] = useState<number | null>(null);
	const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentType | null>(null);
	const [isOpenDate, onOpenDate, onCloseDate] = useDisclose();
	const [currentEditingTimeType, setCurrentEditingTimeType] = useState<'start' | 'end'>('start');

	// Hook con los filtros
	const { ListAssignmentsOwner } = useListAssignmentsOwner({
		from: timeStart,
		to: timeEnd,
		pageNumber: 1,
		pageSize: 10,
		cleanerId: selectedCleanerId,
		paymentType: selectedPaymentType,
	});

	const { GetCleaners } = useGetAllCleaners();

	const totalAmount = useMemo(() => {
		return ListAssignmentsOwner.data?.data.reduce((account, currentValue) => account + currentValue.price, 0);
	}, [ListAssignmentsOwner.data?.data]);

	// Función para manejar selección de operario
	const handleCleanerSelect = useCallback(
		(cleanerId: number) => {
			setSelectedCleanerId(selectedCleanerId === cleanerId ? null : cleanerId);
		},
		[selectedCleanerId]
	);

	const handlePaymentTypeSelect = useCallback(
		(paymentType: PaymentType) => {
			setSelectedPaymentType(selectedPaymentType === paymentType ? null : paymentType);
		},
		[selectedPaymentType]
	);

	const clearFilters = useCallback(() => {
		setSelectedCleanerId(null);
		setSelectedPaymentType(null);
	}, []);

	const keyExtractor = useCallback((item: { id: number }) => item.id.toString(), []);

	const renderItem = useCallback(
		({ item }: { item: AssignmentAdminResponse }) => {
			const paymentType = paymentTypeReturnData(item.paymentType);

			return (
				<View className='flex-1 px-4'>
					<View className='p-4 bg-neutral-900 rounded flex-row items-center gap-3 border-b border-neutral-700'>
						<View className='bg-neutral-800 p-2 rounded-lg'>
							<CustomText className='text-neutral-100'>#{item.id}</CustomText>
						</View>

						<View className='flex-1'>
							{item.paymentType && (
								<View className='mb-2'>
									<CustomText
										className={`text-neutral-100 self-start py-1 px-3 rounded-xl text-xs`}
										style={{
											backgroundColor: paymentType.color,
										}}>
										{paymentType.name}
									</CustomText>
								</View>
							)}

							<View>
								<CustomText className='text-neutral-500 text-xs'>{formatISOToDate(item.dateTime, true)}</CustomText>
							</View>
						</View>

						<View>
							<CustomText
								className='text-neutral-100'
								variantWeight={weight.SemiBold}>
								S/{item.price}
							</CustomText>
						</View>
					</View>
				</View>
			);
		},
		[ListAssignmentsOwner.data?.data]
	);

	const handlePresentModalPress = useCallback((timeType: 'start' | 'end') => {
		onOpenDate();
		setCurrentEditingTimeType(timeType);
	}, []);

	return (
		<Screen isSafeAreaInsets={false}>
			<View className='flex-1'>
				<FlatList
					data={ListAssignmentsOwner.data?.data}
					ItemSeparatorComponent={() => <View className='' />}
					keyExtractor={keyExtractor}
					ListHeaderComponent={() => {
						return (
							<>
								<View className='px-4'>
									<View className=''>
										<View className='bg-neutral-900 mt-3 border-neutral-600 border px-3 py-4 rounded-2xl mb-3'>
											<View className='flex-row items-cente gap-4 mb-2'>
												<Ionicons
													name='calendar-outline'
													size={20}
													color='#61a5fa'
												/>

												<CustomText
													className='text-neutral-300'
													variantWeight={weight.Medium}>
													Periodo de Fechas
												</CustomText>
											</View>

											<View className='flex-row gap-4'>
												<View className='flex-1'>
													<CustomText className='text-neutral-400 mb-2 text-xs'>Inicio</CustomText>
													<Pressable
														className='flex-row items-center gap-3 flex-1 bg-neutral-800 border border-neutral-600'
														style={{
															paddingHorizontal: 24,
															paddingVertical: 12,
															borderRadius: 12,
															justifyContent: 'center',
															alignItems: 'center',
														}}
														onPress={() => handlePresentModalPress('start')}>
														<Ionicons
															name='calendar-outline'
															size={20}
															color='#d4d4d4'
														/>
														<View className='flex-row items-center flex-1'>
															<CustomText
																variantWeight={weight.Medium}
																className='text-neutral-300 text-sm'>
																{formatISOToDate(timeStart)}
															</CustomText>
														</View>
													</Pressable>
												</View>

												<View className='flex-1'>
													<CustomText className='text-neutral-400 mb-2 text-xs'>Fin</CustomText>
													<Pressable
														className='flex-row items-center gap-3 border border-neutral-600'
														style={{
															paddingHorizontal: 24,
															paddingVertical: 12,
															borderRadius: 12,
															justifyContent: 'center',
															alignItems: 'center',
															backgroundColor: '#262626',
														}}
														onPress={() => handlePresentModalPress('end')}>
														<Ionicons
															name='calendar-outline'
															size={20}
															color='#d4d4d4'
														/>
														<View className='flex-row items-center'>
															<CustomText
																variantWeight={weight.Medium}
																className='text-neutral-300 text-sm'>
																{formatISOToDate(timeEnd)}
															</CustomText>
														</View>
													</Pressable>
												</View>
											</View>
										</View>

										<View className='mb-3 p-3 rounded-2xl bg-neutral-900 border border-neutral-600'>
											<View className='flex-row items-center gap-4 mb-4'>
												<Ionicons
													name='person-outline'
													size={20}
													color='#4ade80'
												/>
												<CustomText
													className='text-neutral-300'
													variantWeight={weight.Medium}>
													Operarios
												</CustomText>
											</View>

											<ScrollView
												horizontal
												showsHorizontalScrollIndicator={false}
												className='gap-3 flex-row'>
												{GetCleaners.data?.data.map((cleaner) => {
													const isSelected = selectedCleanerId === cleaner.id;
													return (
														<Pressable
															key={cleaner.id}
															onPress={() => handleCleanerSelect(cleaner.id!)}
															className={`py-2 px-4 mr-2 rounded-xl border ${
																isSelected ? 'bg-blue-600 border-blue-500' : 'bg-neutral-800 border-neutral-600'
															}`}>
															<CustomText className='text-neutral-100 text-sm'>{cleaner.username}</CustomText>
														</Pressable>
													);
												})}
											</ScrollView>
										</View>

										<View className='p-3 rounded-2xl bg-neutral-900 border border-neutral-600'>
											<View className='flex-row items-center gap-4 mb-4'>
												<Ionicons
													name='card-outline'
													size={20}
													color='#c184fc'
												/>
												<CustomText
													className='text-neutral-300'
													variantWeight={weight.Medium}>
													Tipo de Pago
												</CustomText>
											</View>

											<View className='flex-row gap-2 flex-wrap'>
												<Pressable
													onPress={() => handlePaymentTypeSelect('YAPE')}
													className={`px-4 py-2 rounded-xl mb-2 ${
														selectedPaymentType === 'YAPE' ? 'bg-[#4a1458]' : 'bg-neutral-800'
													}`}>
													<CustomText className='text-white text-sm'>Yape</CustomText>
												</Pressable>
												<Pressable
													onPress={() => handlePaymentTypeSelect('PLIN')}
													className={`px-4 py-2 rounded-xl mb-2 ${
														selectedPaymentType === 'PLIN' ? 'bg-[#2fb8c4]' : 'bg-neutral-800'
													}`}>
													<CustomText className='text-white text-sm'>Plin</CustomText>
												</Pressable>
												<Pressable
													onPress={() => handlePaymentTypeSelect('TRANSFER')}
													className={`px-4 py-2 rounded-xl mb-2 ${
														selectedPaymentType === 'TRANSFER' ? 'bg-orange-700' : 'bg-neutral-800'
													}`}>
													<CustomText className='text-white text-sm'>Transferencia</CustomText>
												</Pressable>
												<Pressable
													onPress={() => handlePaymentTypeSelect('CASH')}
													className={`px-4 py-2 rounded-xl mb-2 ${
														selectedPaymentType === 'CASH' ? 'bg-green-700' : 'bg-neutral-800'
													}`}>
													<CustomText className='text-white text-sm'>Efectivo</CustomText>
												</Pressable>
											</View>
										</View>

										<View className='flex-row justify-between items-center mt-3'>
											{(selectedCleanerId || selectedPaymentType) && (
												<View className='flex-row gap-2 flex-1 '>
													{selectedCleanerId && (
														<View className='bg-blue-600 mb-3 px-3 py-1 rounded-full flex-row items-center gap-1'>
															<CustomText className='text-white text-xs'>
																{GetCleaners.data?.data.find((c) => c.id === selectedCleanerId)?.username}
															</CustomText>
															<Pressable onPress={() => setSelectedCleanerId(null)}>
																<Ionicons
																	name='close'
																	size={14}
																	color='white'
																/>
															</Pressable>
														</View>
													)}

													{selectedPaymentType && (
														<View
															style={{
																backgroundColor: paymentTypeReturnData(selectedPaymentType).color,
															}}
															className='px-3 py-1 rounded-full flex-row items-center gap-1 mb-3'>
															<CustomText className='text-white text-xs'>
																{paymentTypeReturnData(selectedPaymentType).name}
															</CustomText>
															<Pressable onPress={() => setSelectedPaymentType(null)}>
																<Ionicons
																	name='close'
																	size={14}
																	color='white'
																/>
															</Pressable>
														</View>
													)}
												</View>
											)}
										</View>
									</View>
								</View>

								{/* Modal de calendario */}
								<Actionsheet
									isOpen={isOpenDate}
									onClose={onCloseDate}>
									<ActionsheetBackdrop />
									<ActionsheetContent>
										<ActionsheetDragIndicatorWrapper>
											<ActionsheetDragIndicator />
										</ActionsheetDragIndicatorWrapper>
										<View className='py-4 w-full'>
											<CalendarWheel
												title='Selecciona una fecha'
												onSubmit={(value) => {
													if (currentEditingTimeType === 'start') {
														setTimeStart(value.date);
													} else {
														setTimeEnd(value.date);
													}
													onCloseDate();
												}}
											/>
										</View>
									</ActionsheetContent>
								</Actionsheet>

								<LinearGradient
									colors={['#1e1b4b', '#0f172a']}
									start={{ x: 0, y: 0 }}
									end={{ x: 1.5, y: 0 }}
									style={{
										borderRadius: 14,
									}}
									locations={[0, 0.6, 1]}
									className='rounded-2xl mx-4 mb-6 p-4 mt-0 border border-blue-900'>
									<View className='flex-row justify-between'>
										<View className='flex-row gap-4 items-center mb-2'>
											<Ionicons
												name='trending-up-outline'
												size={20}
												color='#61a5fa'
											/>
											<CustomText className='text-neutral-300'>Total recaudado</CustomText>
										</View>

										<CustomText className='text-neutral-400 text-sm'>
											{ListAssignmentsOwner.data?.data.length || 0} servicios
										</CustomText>
									</View>

									<CustomText
										className='text-neutral-100 text-3xl'
										variantWeight={weight.SemiBold}>
										S/{totalAmount?.toFixed(2) ?? '0.00'}
									</CustomText>
								</LinearGradient>

								<CustomText
									className='text-neutral-100 text-lg px-4 mb-3'
									variantWeight={weight.TitleMedium}>
									Lista de Pagos
								</CustomText>
							</>
						);
					}}
					renderItem={renderItem}
				/>
			</View>
		</Screen>
	);
}
