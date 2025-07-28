import { useCallback, useMemo, useState } from 'react';
import { Dimensions, FlatList, Image, Pressable, ScrollView, View } from 'react-native';
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

	console.log('selectedPaymentType', selectedPaymentType);

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
				<View className='w-full flex-1 px-4'>
					<View className='p-4 bg-neutral-900 rounded-xl flex-row items-center gap-3'>
						<View>
							<CustomText className='text-neutral-100'>#{item.id}</CustomText>
						</View>

						<View className='flex-1'>
							<View className='mb-2'>
								<CustomText className='text-neutral-100'>{item.detail}</CustomText>
							</View>

							{item.paymentType && (
								<View className='mb-2'>
									<CustomText
										className={`text-neutral-100 self-start py-1 px-3 rounded-3xl text-xs`}
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
					ItemSeparatorComponent={() => <View className='h-4' />}
					keyExtractor={keyExtractor}
					ListHeaderComponent={() => {
						return (
							<>
								<View className='px-4 mb-4'>
									<View className=''>
										<View className='flex-row justify-between items-center mb-4'>
											<CustomText className='text-neutral-100 text-lg'>Filtros</CustomText>
											{(selectedCleanerId || selectedPaymentType) && (
												<Pressable
													onPress={clearFilters}
													className='bg-red-600 px-3 py-1 rounded-lg'>
													<CustomText className='text-white text-sm'>Limpiar</CustomText>
												</Pressable>
											)}
										</View>

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

										<View className='mb-4'>
											<CustomText className='text-neutral-300 mb-3'>Operarios</CustomText>
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
																isSelected ? 'bg-blue-600 border-blue-500' : 'bg-neutral-700 border-neutral-600'
															}`}>
															<CustomText className='text-neutral-100 text-sm'>{cleaner.username}</CustomText>
														</Pressable>
													);
												})}
											</ScrollView>
										</View>

										<View>
											<CustomText className='text-neutral-300 mb-3'>Tipo de pago</CustomText>
											<View className='flex-row gap-2 flex-wrap'>
												<Pressable
													onPress={() => handlePaymentTypeSelect('YAPE')}
													className={`px-4 py-2 rounded-xl mb-2 ${
														selectedPaymentType === 'YAPE' ? 'bg-[#4a1458]' : 'bg-[#3a034d]'
													}`}>
													<CustomText className='text-white text-sm'>Yape</CustomText>
												</Pressable>
												<Pressable
													onPress={() => handlePaymentTypeSelect('PLIN')}
													className={`px-4 py-2 rounded-xl mb-2 ${
														selectedPaymentType === 'PLIN' ? 'bg-[#2fb8c4]' : 'bg-[#1fa8b4]'
													}`}>
													<CustomText className='text-white text-sm'>Plin</CustomText>
												</Pressable>
												<Pressable
													onPress={() => handlePaymentTypeSelect('TRANSFER')}
													className={`px-4 py-2 rounded-xl mb-2 ${
														selectedPaymentType === 'TRANSFER' ? 'bg-orange-700' : 'bg-orange-600'
													}`}>
													<CustomText className='text-white text-sm'>Transferencia</CustomText>
												</Pressable>
												<Pressable
													onPress={() => handlePaymentTypeSelect('CASH')}
													className={`px-4 py-2 rounded-xl mb-2 ${
														selectedPaymentType === 'CASH' ? 'bg-green-700' : 'bg-green-600'
													}`}>
													<CustomText className='text-white text-sm'>Efectivo</CustomText>
												</Pressable>
											</View>
										</View>

										<View className='flex-row justify-between items-center mb-3 mt-3'>
											{(selectedCleanerId || selectedPaymentType) && (
												<View className='flex-row gap-2 flex-1 '>
													{selectedCleanerId && (
														<View className='bg-blue-600 px-3 py-1 rounded-full flex-row items-center gap-1'>
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
														<View className='bg-green-600 px-3 py-1 rounded-full flex-row items-center gap-1'>
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

								{/* Total */}
								<View className='justify-center mx-4 items-center mb-4 p-4 rounded-xl bg-neutral-800 border border-neutral-700'>
									<CustomText className='text-neutral-300 mb-2'>Total</CustomText>
									<CustomText
										className='text-neutral-100 text-3xl'
										variantWeight={weight.SemiBold}>
										S/{totalAmount?.toFixed(2) ?? '0.00'}
									</CustomText>
									<CustomText className='text-neutral-400 text-sm mt-1'>
										{ListAssignmentsOwner.data?.data.length || 0} servicios
									</CustomText>
								</View>

								<CustomText
									className='text-neutral-100 text-lg px-4 mb-3'
									variantWeight={weight.Medium}>
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
