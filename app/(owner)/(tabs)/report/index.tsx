import { useCallback, useMemo, useState } from 'react';
import { Dimensions, FlatList, Pressable, View } from 'react-native';
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
import { ChevronDownIcon } from '@/components/ui/icon';
import CalendarWheel from '@/components/ui/calendar-wheel';
import { useListAssignmentsOwner } from '@/presentation/appoinment/hooks/use-list-assignments-owner';
import { AssignmentAdminResponse } from '@/core/appointment/interfaces';
import { LineChart } from 'react-native-gifted-charts';
import { useGetAllCleaners } from '@/presentation/user/hooks/use-get-all-cleaners';

export default function ReportScreen() {
	const [timeStart, setTimeStart] = useState<Date>(new Date());
	const [timeEnd, setTimeEnd] = useState<Date>(new Date());
	const [isOpen, onOpen, onClose] = useDisclose();
	const [currentEditingTimeType, setCurrentEditingTimeType] = useState<'start' | 'end'>('start');
	const { ListAssignmentsOwner } = useListAssignmentsOwner({ from: timeStart, to: timeEnd, pageNumber: 1, pageSize: 10 });
	const { GetCleaners } = useGetAllCleaners();

	const totalAmount = useMemo(() => {
		return ListAssignmentsOwner.data?.data.reduce((account, currentValue) => account + currentValue.price, 0);
	}, [ListAssignmentsOwner.data?.data]);

	const appoinmentsData = useMemo(() => {
		return Array.isArray(ListAssignmentsOwner.data?.data)
			? ListAssignmentsOwner.data?.data
					.sort((a, b) => {
						const dateA = new Date(a.dateTime);
						const dateB = new Date(b.dateTime);
						return dateA.getTime() - dateB.getTime();
					})
					.map((appoinment) => {
						return {
							value: appoinment.price,
							dataPointText: appoinment.price.toString(),
						};
					})
			: [];
	}, [timeStart, timeEnd, ListAssignmentsOwner.data?.data]);

	const keyExtractor = useCallback((item: { id: number }) => item.id.toString(), []);

	const renderItem = useCallback(
		({ item }: { item: AssignmentAdminResponse }) => {
			return (
				<>
					<View className='w-full flex-1 px-4'>
						<View className='p-4 bg-neutral-900 rounded-xl flex-row items-center gap-3'>
							<View>
								<CustomText className='text-neutral-100'>#{item.id}</CustomText>
							</View>

							<View className='flex-1'>
								<View className=''>
									<CustomText className='text-neutral-100'>{item.detail}</CustomText>
								</View>

								<View className=''>
									<CustomText className='text-neutral-500 text-sm'>{formatISOToDate(item.dateTime, true)}</CustomText>
								</View>
							</View>

							<View className=''>
								<CustomText
									className='text-neutral-100'
									variantWeight={weight.SemiBold}>
									S/{item.price}
								</CustomText>
							</View>
						</View>
					</View>
				</>
			);
		},
		[ListAssignmentsOwner.data?.data]
	);

	const handlePresentModalPress = useCallback((timeType: 'start' | 'end') => {
		onOpen();
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
								<View>
									<View className='mb-4 flex-row gap-4 px-4'>
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

									<Pressable
										className='bg-neutral-800 p-3 mb-3 rounded-xl self-end mx-4'
										onPress={onOpen}>
										<Ionicons
											name='options-outline'
											size={24}
											color='white'
										/>
									</Pressable>

									<Actionsheet
										isOpen={isOpen}
										onClose={onClose}>
										<ActionsheetBackdrop />
										<ActionsheetContent>
											<ActionsheetDragIndicatorWrapper>
												<ActionsheetDragIndicator />
											</ActionsheetDragIndicatorWrapper>
											<View className='py-4 w-full'>
												{/* <CalendarWheel
													title='Selecciona una fecha'
													onSubmit={(value) => {
														if (currentEditingTimeType === 'start') {
															setTimeStart(value.date);
														} else {
															setTimeEnd(value.date);
														}

														onClose();
													}}
												/> */}

												<CustomText className='text-neutral-100 text-lg mb-2'>Filtros</CustomText>

												<Select>
													<SelectTrigger
														className='justify-between'
														variant='rounded'
														size='md'>
														<SelectTrigger style={{ borderWidth: 0 }}>
															<SelectInput
																placeholder='Seleccionar un operario'
																placeholderTextColor={'#8c8c90'}
															/>
															<SelectIcon className='mr-3' />
														</SelectTrigger>
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
																label='--Seleccionar--'
																value=''
															/>

															{GetCleaners.data?.data.map((cleaner) => (
																<SelectItem
																	key={cleaner.id}
																	label={cleaner.username}
																	value={cleaner?.id?.toString()!}
																/>
															))}
														</SelectContent>
													</SelectPortal>
												</Select>
											</View>
										</ActionsheetContent>
									</Actionsheet>
								</View>

								<View className='justify-center mx-4 items-center mb-3 h-56 rounded-xl bg-neutral-800 border border-neutral-700'>
									<CustomText className='text-neutral-300 mb-2'>Total</CustomText>
									<CustomText
										className='text-neutral-100 text-5xl'
										variantWeight={weight.SemiBold}>
										S/{totalAmount?.toFixed(2) ?? 0}
									</CustomText>
								</View>

								{/* <CustomChart /> */}

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
