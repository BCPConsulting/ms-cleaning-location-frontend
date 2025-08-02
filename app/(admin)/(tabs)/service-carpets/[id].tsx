import { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { CustomText, weight } from '@/components/ui/custom-text';
import { Screen } from '@/components/ui/screen';
import { Spinner } from '@/components/ui/spinner';
import { useGetDelivery } from '@/presentation/delivery/hooks/use-get-delivery';
import { useGetAllCleaners } from '@/presentation/user/hooks/use-get-all-cleaners';
import { ChevronDownIcon } from '@/components/ui/icon';
import { paymentTypeReturnData } from '@/utils/payment-type-return-data';
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
import { Radio, RadioGroup, RadioIndicator, RadioLabel, RadioIcon } from '@/components/ui/radio';
import Button from '@/components/ui/button';
import { Formik, FormikHelpers } from 'formik';
import Input from '@/components/ui/input';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useCreateLogistic } from '@/presentation/logistic-event/hooks/use-create-logistic-event';
import { CircleIcon } from '@/components/ui/icon';
import { useKeyboard } from '@/hooks/use-key-board';
import validationCreateLogisticEvent from '@/presentation/logistic-event/validation/create-logistic-event-validation';
import { CreateLogisticEvent } from '@/core/logistic-event/interfaces';
import { AssignmentStatus, LogisticEventType } from '@/core/shared/interfaces';
import { MapViewContextApi } from '@/context/map-view-context';
import { useUpdateLogistic } from '@/presentation/logistic-event/hooks/use-update-logistic-event';
import { useToast } from '@/hooks/use-toast';
import { Colors } from '@/constants/Colors';
import { statusReturnTypeData } from '@/utils/status-type-return-data';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

interface FormLogisticEvent {
	eventType: LogisticEventType;
	coordinates: string;
	locationName: string;
	locationReference: string;
	cleanerId: string;
	deliveryId: string;
	assignmentStatus: AssignmentStatus;
	dateTime: string;
}

const InitialValueLogisticEvent: FormLogisticEvent = {
	eventType: 'PICKUP',
	coordinates: '',
	locationName: '',
	locationReference: '',
	cleanerId: '',
	deliveryId: '',
	assignmentStatus: 'UNASSIGNED',
	dateTime: '',
};

export function formatDateToISO(dateString: string): string {
	if (!dateString || dateString.trim() === '') {
		return '';
	}

	try {
		const [datePart, timePart = '00:00'] = dateString.split(' ');
		const [day, month, year] = datePart.split('/');
		const [hours, minutes] = timePart.split(':');

		const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));

		if (isNaN(date.getTime())) {
			throw new Error('Invalid date');
		}

		const year_str = date.getFullYear();
		const month_str = (date.getMonth() + 1).toString().padStart(2, '0');
		const day_str = date.getDate().toString().padStart(2, '0');
		const hours_str = date.getHours().toString().padStart(2, '0');
		const minutes_str = date.getMinutes().toString().padStart(2, '0');
		const seconds_str = date.getSeconds().toString().padStart(2, '0');

		console.log('Fecha de vuelta', `${year_str}-${month_str}-${day_str}T${hours_str}:${minutes_str}:${seconds_str}`);

		return `${year_str}-${month_str}-${day_str}T${hours_str}:${minutes_str}:${seconds_str}`;
	} catch (error) {
		console.error('Error converting date to ISO:', error);
		return '';
	}
}

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

export default function EditService() {
	// Todos los hooks al principio
	const { id } = useLocalSearchParams();
	const { currentCoordinates } = useContext(MapViewContextApi);
	const [currentIndex, setCurrentIndex] = useState(1);
	const { isKeyboardVisible, dismissKeyboard } = useKeyboard();
	const { GetDelivery } = useGetDelivery(+id);
	const { GetCleaners } = useGetAllCleaners();
	const { CreateLogistic } = useCreateLogistic();
	const { UpdateLogistic } = useUpdateLogistic();
	const { toastError } = useToast();
	const bottomSheetRef = useRef<BottomSheet>(null);

	const snapPoints = useMemo(() => ['100%'], []);

	const delivery = GetDelivery.data?.data;
	const pickupEvent = delivery?.logisticEvents.find((event) => event.eventType === 'PICKUP');
	const shippingEvent = delivery?.logisticEvents.find((event) => event.eventType === 'SHIPPING');

	const pickupInitialValues = useMemo(() => {
		const pickup = delivery?.logisticEvents.find((event) => event.eventType === 'PICKUP');
		return {
			locationName: pickup?.locationName || '',
			locationReference: pickup?.locationReference || '',
			cleanerId: pickup?.cleanerId?.toString() || '',
			coordinates: pickup?.coordinates || '',
			dateTime: pickup?.dateTime ? formatISOToDisplayDate(pickup.dateTime) : '',
		};
	}, [delivery]);

	const shippingInitialValues = useMemo(() => {
		const shipping = delivery?.logisticEvents.find((event) => event.eventType === 'SHIPPING');

		return {
			locationName: shipping?.locationName || '',
			locationReference: shipping?.locationReference || '',
			cleanerId: shipping?.cleanerId?.toString() || '',
			coordinates: shipping?.coordinates || '',
			dateTime: shipping?.dateTime ? formatISOToDisplayDate(shipping.dateTime) : '',
		};
	}, [delivery]);

	const handlePickupSubmit = useCallback(
		(values: any) => {
			const isoDateTime = formatDateToISO(values.dateTime);

			UpdateLogistic.mutate({
				id: +pickupEvent?.id!,
				deliveryId: id as string,
				eventType: 'PICKUP',
				assignmentStatus: values.cleanerId ? 'ASSIGNED' : 'UNASSIGNED',
				locationName: values.locationName,
				locationReference: values.locationReference,
				cleanerId: values.cleanerId,
				coordinates: `${currentCoordinates.latitude},${currentCoordinates.longitude}`,
				dateTime: isoDateTime,
			});
		},
		[pickupEvent?.id, id, UpdateLogistic]
	);

	const handleShippingSubmit = useCallback(
		(values: any) => {
			const isoDateTime = formatDateToISO(values.dateTime);

			UpdateLogistic.mutate({
				id: +shippingEvent?.id!,
				deliveryId: id as string,
				eventType: 'SHIPPING',
				assignmentStatus: values.cleanerId ? 'ASSIGNED' : 'UNASSIGNED',
				locationName: values.locationName,
				locationReference: values.locationReference,
				cleanerId: values.cleanerId,
				coordinates: `${currentCoordinates.latitude},${currentCoordinates.longitude}`,
				dateTime: isoDateTime,
			});
		},
		[shippingEvent?.id, id, UpdateLogistic]
	);

	const handleSheetChanges = useCallback(
		(index: number) => {
			if (index < currentIndex && isKeyboardVisible) {
				setTimeout(() => {
					dismissKeyboard();
				}, 150);
			}
			setCurrentIndex(index);
		},
		[currentIndex, isKeyboardVisible, dismissKeyboard]
	);

	const handleSubmitCreateLogisticEvent = useCallback(
		(values: CreateLogisticEvent, formik: FormikHelpers<CreateLogisticEvent>) => {
			const existingEventLogicPickup = GetDelivery.data?.data.logisticEvents.find(
				(logistic) => logistic.eventType === 'PICKUP'
			);

			const existingEventLogicShipping = GetDelivery.data?.data.logisticEvents.find(
				(logistic) => logistic.eventType === 'SHIPPING'
			);

			if (values.eventType === existingEventLogicPickup?.eventType) {
				toastError('Ya existe el evento de recojo');
				return;
			}

			if (values.eventType === existingEventLogicShipping?.eventType) {
				toastError('Ya existe el evento de envio');
				return;
			}

			const isoDateTime = formatDateToISO(values.dateTime);

			CreateLogistic.mutate({
				deliveryId: id as string,
				eventType: values.eventType,
				assignmentStatus: values.cleanerId ? 'ASSIGNED' : 'UNASSIGNED',
				locationName: values.locationName,
				locationReference: values.locationReference,
				cleanerId: values.cleanerId,
				coordinates: `${currentCoordinates.latitude},${currentCoordinates.longitude}`,
				dateTime: isoDateTime,
			});

			formik.resetForm();
		},
		[currentCoordinates, id, CreateLogistic]
	);

	if (GetDelivery.isPending || GetDelivery.isLoading || !delivery) {
		return (
			<Screen>
				<View className='flex-1 justify-center items-center'>
					<Spinner
						size='large'
						color={Colors.dark.primary}
					/>
				</View>
			</Screen>
		);
	}

	return (
		<Screen>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
				<ScrollView
					className='flex-1 px-4'
					contentContainerStyle={{ paddingBottom: 50 }}
					keyboardShouldPersistTaps='handled'
					showsVerticalScrollIndicator={false}>
					<View className='mb-6'>
						<View className='flex-row items-center mb-3 gap-3'>
							<View
								className='rounded-full px-3 py-1'
								style={{
									backgroundColor: paymentTypeReturnData(delivery.paymentType).color,
								}}>
								<CustomText className='text-neutral-100 text'>
									{paymentTypeReturnData(delivery.paymentType).name}
								</CustomText>
							</View>

							<View
								className='rounded-xl px-3 py-1 my-3 bg-green-600/20'
								style={{
									backgroundColor: statusReturnTypeData(delivery.cleaningStatus).color,
								}}>
								<CustomText
									className='capitalize'
									styleCustom={{
										color: 'white',
									}}>
									{statusReturnTypeData(delivery.cleaningStatus).name}
								</CustomText>
							</View>
						</View>

						<CustomText
							className='text-neutral-100 text-lg mb-1'
							variantWeight={weight.Medium}>
							{delivery.clientName}
						</CustomText>

						<CustomText
							className='text-green-400 text-xl'
							variantWeight={weight.Bold}>
							S/ {delivery.price}
						</CustomText>
					</View>

					{pickupEvent && (
						<Formik
							initialValues={pickupInitialValues}
							onSubmit={handlePickupSubmit}
							enableReinitialize>
							{({ values, errors, touched, handleBlur, handleSubmit, handleChange, setFieldValue }) => {
								const selectedCleaner = GetCleaners.data?.data.find(
									(cleaner) => cleaner?.id!.toString() === values.cleanerId
								);

								return (
									<View className='mb-6 bg-neutral-900 p-4 rounded-lg'>
										<CustomText
											className='text-neutral-100 mb-4 text-lg'
											variantWeight={weight.Medium}>
											Recojo
											{pickupEvent?.id && (
												<CustomText className='text-neutral-400 text-sm'>(ID: {pickupEvent.id})</CustomText>
											)}
										</CustomText>

										<View className='mb-3'>
											<Input
												label='Lugar'
												value={values.locationName}
												onChangeText={handleChange('locationName')}
												onBlur={handleBlur('locationName')}
												placeholder='Ingresar lugar'
												multiline
												error={!!(touched.locationName && errors.locationName)}
												name='locationName'
											/>
										</View>

										<View className='mb-3'>
											<Input
												label='Referencia'
												value={values.locationReference}
												onChangeText={handleChange('locationReference')}
												onBlur={handleBlur('locationReference')}
												placeholder='Ingresar referencia'
												multiline
												error={!!(touched.locationReference && errors.locationReference)}
												name='locationReference'
											/>
										</View>

										<View className='mb-3'>
											<Input
												label='Fecha y Hora'
												value={values.dateTime}
												onChangeText={handleChange('dateTime')}
												onBlur={handleBlur('dateTime')}
												placeholder='dd/mm/yyyy hh:mm'
												error={!!(touched.dateTime && errors.dateTime)}
												name='dateTime'
											/>
										</View>

										<View className='mb-3'>
											<CustomText
												className='mb-2 text-neutral-400 text-sm'
												variantWeight={weight.Medium}>
												Asignar operario
											</CustomText>

											<Select
												selectedValue={values.cleanerId}
												defaultValue={values.cleanerId}
												initialLabel={selectedCleaner?.username}
												onValueChange={(cleanerId) => {
													setFieldValue('cleanerId', cleanerId);
												}}>
												<SelectTrigger
													className='justify-between'
													style={{ borderWidth: 0, backgroundColor: '#26282b', borderRadius: 12 }}
													variant='rounded'
													size='md'>
													<SelectInput
														placeholder='Seleccionar un operario'
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
															label='--Seleccionar--'
															value=''
														/>
														{GetCleaners.data?.data.map((cleaner) => (
															<SelectItem
																key={cleaner.id}
																label={cleaner.username}
																value={cleaner?.id!.toString()}
															/>
														))}
													</SelectContent>
												</SelectPortal>
											</Select>
										</View>

										<Button
											variant='light'
											onPress={() => router.push('/(admin)/(tabs)/service-carpets/map-view')}
											className='mb-3 flex-row items-center gap-3'>
											<MaterialIcons
												name='location-pin'
												size={24}
												color='white'
											/>
											<CustomText
												className='text-neutral-100'
												variantWeight={weight.Title}>
												Elegir Ubicación Recojo
											</CustomText>
										</Button>

										<Button
											text={pickupEvent?.id ? 'Actualizar Recojo' : 'Crear Recojo'}
											onPress={() => handleSubmit()}
											disabled={UpdateLogistic.isPending}
											isLoading={UpdateLogistic.isPending}
										/>
									</View>
								);
							}}
						</Formik>
					)}

					{/* SEGUNDO FORMIK - SOLO ENVÍO */}
					{shippingEvent && (
						<Formik
							initialValues={shippingInitialValues}
							onSubmit={handleShippingSubmit}
							enableReinitialize>
							{({ values, errors, touched, handleBlur, handleSubmit, handleChange, setFieldValue }) => {
								const selectedCleaner = GetCleaners.data?.data.find(
									(cleaner) => cleaner?.id!.toString() === values.cleanerId
								);

								return (
									<View className='mb-6 bg-neutral-900 p-4 rounded-lg'>
										<CustomText
											className='text-neutral-100 mb-4 text-lg'
											variantWeight={weight.Medium}>
											Envío
											{shippingEvent?.id && (
												<CustomText className='text-neutral-400 text-sm'>(ID: {shippingEvent.id})</CustomText>
											)}
										</CustomText>

										<View className='mb-3'>
											<Input
												label='Lugar'
												value={values.locationName}
												onChangeText={handleChange('locationName')}
												onBlur={handleBlur('locationName')}
												placeholder='Ingresar lugar'
												multiline
												error={!!(touched.locationName && errors.locationName)}
												name='locationName'
											/>
										</View>

										<View className='mb-3'>
											<Input
												label='Referencia'
												value={values.locationReference}
												onChangeText={handleChange('locationReference')}
												onBlur={handleBlur('locationReference')}
												placeholder='Ingresar referencia'
												multiline
												error={!!(touched.locationReference && errors.locationReference)}
												name='locationReference'
											/>
										</View>

										<View className='mb-3'>
											<Input
												label='Fecha y Hora'
												value={values.dateTime}
												onChangeText={handleChange('dateTime')}
												onBlur={handleBlur('dateTime')}
												placeholder='Fecha y hora del evento'
												error={!!(touched.dateTime && errors.dateTime)}
												name='dateTime'
											/>
										</View>

										<View className='mb-3'>
											<CustomText
												className='mb-2 text-neutral-400 text-sm'
												variantWeight={weight.Medium}>
												Asignar operario
											</CustomText>

											<Select
												selectedValue={values.cleanerId}
												defaultValue={values.cleanerId}
												initialLabel={selectedCleaner?.username}
												onValueChange={(cleanerId) => {
													setFieldValue('cleanerId', cleanerId);
												}}>
												<SelectTrigger
													className='justify-between'
													style={{ borderWidth: 0, backgroundColor: '#26282b', borderRadius: 12 }}
													variant='rounded'
													size='md'>
													<SelectInput
														placeholder='Seleccionar un operario'
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
															label='--Seleccionar--'
															value=''
														/>
														{GetCleaners.data?.data.map((cleaner) => (
															<SelectItem
																key={cleaner.id}
																label={cleaner.username}
																value={cleaner?.id!.toString()}
															/>
														))}
													</SelectContent>
												</SelectPortal>
											</Select>
										</View>

										{/* <Button
											text='Elegir Ubicación Envío'
											variant='light'
											onPress={() => router.push('/(admin)/(tabs)/service-carpets/map-view')}
											className='mb-3 mt-5'
										/>

										<Button
											variant='outline'
											text={shippingEvent?.id ? 'Actualizar Envío' : 'Crear Envío'}
											onPress={() => handleSubmit()}
											disabled={CreateLogistic.isPending}
											isLoading={CreateLogistic.isPending}
										/> */}

										<Button
											variant='light'
											onPress={() => router.push('/(admin)/(tabs)/service-carpets/map-view')}
											className='mb-3 flex-row items-center gap-3'>
											<MaterialIcons
												name='location-pin'
												size={24}
												color='white'
											/>
											<CustomText
												className='text-neutral-100'
												variantWeight={weight.Title}>
												Elegir Ubicación Envío
											</CustomText>
										</Button>

										<Button
											text={'Guardar Envío'}
											onPress={() => handleSubmit()}
											disabled={UpdateLogistic.isPending}
											isLoading={UpdateLogistic.isPending}
										/>
									</View>
								);
							}}
						</Formik>
					)}

					<View className='w-full py-4'>
						<Button
							text='Crear Delivery'
							className='flex-row items-center gap-2'
							onPress={() => bottomSheetRef.current?.expand()}>
							<Ionicons
								name='add'
								size={20}
								color='white'
							/>
							<CustomText
								className='text-neutral-100'
								variantWeight={weight.Title}>
								Crear Nuevo Evento
							</CustomText>
						</Button>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>

			{/* BottomSheet para crear nuevo evento */}
			<BottomSheet
				ref={bottomSheetRef}
				index={-1}
				snapPoints={snapPoints}
				enablePanDownToClose={true}
				handleIndicatorStyle={{ backgroundColor: '#fff' }}
				backgroundStyle={{ backgroundColor: '#171717' }}
				enableContentPanningGesture={true}
				enableHandlePanningGesture={true}
				enableDynamicSizing={false}
				onChange={handleSheetChanges}
				keyboardBehavior='fillParent'>
				<KeyboardAvoidingView
					style={{ flex: 1 }}
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
					<BottomSheetScrollView
						style={{ backgroundColor: '#171717', position: 'relative', padding: 12 }}
						nestedScrollEnabled={true}
						contentContainerStyle={{
							paddingBottom: Platform.select({ ios: 300, android: 250 }),
						}}>
						<View className='w-full'>
							<CustomText
								className='text-neutral-100 mb-3'
								variantWeight={weight.Medium}>
								Formulario delivery
							</CustomText>

							<Formik
								initialValues={InitialValueLogisticEvent}
								validationSchema={validationCreateLogisticEvent}
								onSubmit={handleSubmitCreateLogisticEvent}>
								{({ values, handleChange, handleBlur, handleSubmit, errors, touched, setFieldValue }) => {
									return (
										<View>
											<View className='mb-2'>
												<Input
													label='Lugar'
													placeholder='Ingresar lugar'
													value={values.locationName}
													onChangeText={handleChange('locationName')}
													onFocus={() => bottomSheetRef.current?.expand()}
													name='locationName'
													onBlur={handleBlur('locationName')}
													error={!!(touched.locationName && errors.locationName)}
												/>
											</View>

											<View className='mb-3'>
												<Input
													label='Referencia'
													placeholder='Ingresar referencia'
													value={values.locationReference}
													onChangeText={handleChange('locationReference')}
													onFocus={() => bottomSheetRef.current?.expand()}
													name='locationReference'
													onBlur={handleBlur('locationReference')}
													error={!!(touched.locationReference && errors.locationReference)}
												/>
											</View>

											<View className='mb-3'>
												<Input
													label='Fecha y Hora'
													value={values.dateTime}
													onChangeText={handleChange('dateTime')}
													onBlur={handleBlur('dateTime')}
													placeholder='dd/mm/yyyy hh-mm'
													error={!!(errors?.dateTime && touched?.dateTime)}
													name='dateTime'
												/>
											</View>

											<RadioGroup
												value={values.eventType}
												onChange={(value) => setFieldValue('eventType', value)}
												className='mb-5'>
												<View className='flex-row gap-4'>
													<Radio value='PICKUP'>
														<RadioIndicator>
															<RadioIcon as={CircleIcon} />
														</RadioIndicator>
														<RadioLabel>Recojo</RadioLabel>
													</Radio>
													<Radio value='SHIPPING'>
														<RadioIndicator>
															<RadioIcon as={CircleIcon} />
														</RadioIndicator>
														<RadioLabel>Envio</RadioLabel>
													</Radio>
												</View>
											</RadioGroup>

											{errors.eventType && touched.eventType ? (
												<CustomText
													className='mt-2 mb-4 text-sm text-rose-300'
													variantWeight={weight.Medium}>
													{errors.eventType}
												</CustomText>
											) : null}

											<View className='mb-3'>
												<CustomText
													className='mb-2 text-neutral-400 text-sm'
													variantWeight={weight.Medium}>
													Asignar operario
												</CustomText>

												<Select
													selectedValue={values.cleanerId}
													defaultValue={values.cleanerId}
													initialLabel={''}
													onValueChange={(cleanerId) => {
														setFieldValue('cleanerId', cleanerId);
													}}>
													<SelectTrigger
														className='justify-between'
														style={{ borderWidth: 0, backgroundColor: '#262626', borderRadius: 12 }}
														variant='rounded'
														size='md'>
														<SelectInput
															placeholder='Seleccionar un operario'
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
																label='--Seleccionar--'
																value=''
															/>
															{GetCleaners.data?.data.map((cleaner) => (
																<SelectItem
																	key={cleaner.id}
																	label={cleaner.username}
																	value={cleaner?.id!.toString()}
																/>
															))}
														</SelectContent>
													</SelectPortal>
												</Select>

												{errors.cleanerId && touched.cleanerId ? (
													<CustomText
														className='mt-2 mb-4 text-sm text-rose-300'
														variantWeight={weight.Medium}>
														{errors.cleanerId}
													</CustomText>
												) : null}
											</View>

											<Button
												text='Crear servicio'
												isLoading={CreateLogistic.isPending}
												disabled={CreateLogistic.isPending}
												onPress={() => handleSubmit()}
											/>
										</View>
									);
								}}
							</Formik>
						</View>
					</BottomSheetScrollView>
				</KeyboardAvoidingView>
			</BottomSheet>
		</Screen>
	);
}
