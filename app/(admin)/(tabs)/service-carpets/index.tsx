import { useCallback, useMemo, useRef, useState } from 'react';
import { Dimensions, FlatList, KeyboardAvoidingView, Platform, Pressable, RefreshControl, View } from 'react-native';
import { router } from 'expo-router';
import { Formik, FormikHelpers, FormikValues } from 'formik';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { CustomText, weight } from '@/components/ui/custom-text';
import { Screen } from '@/components/ui/screen';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { Radio, RadioGroup, RadioIndicator, RadioLabel, RadioIcon } from '@/components/ui/radio';
import { CircleIcon } from '@/components/ui/icon';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';
import { useKeyboard } from '@/hooks/use-key-board';
import { CreateServiceDelivery, Delivery } from '@/core/delivery/interfaces';
import { paymentTypeReturnData } from '@/utils/payment-type-return-data';
import validationCreateDelivery from '@/presentation/delivery/validation/create-delivery-validation';
import { useCreateDelivery } from '@/presentation/delivery/hooks/use-create-delivery';
import { useListDeliveryFilter } from '@/presentation/delivery/hooks/use-list-delivery-filter';
import { Ionicons } from '@expo/vector-icons';

const initialValues: CreateServiceDelivery = {
	price: '',
	paymentType: 'YAPE',
	clientName: '',
	cleaningStatus: 'PENDING',
	status: 'ACTIVE',
	phone: '',
};

export default function ServiceCarpetsScreen() {
	const [currentIndex, setCurrentIndex] = useState(1);
	const { isKeyboardVisible, dismissKeyboard } = useKeyboard();
	const bottomSheetRef = useRef<BottomSheet>(null);
	const { ListDeliveriesFilter } = useListDeliveryFilter({
		pageNumber: 1,
		pageSize: 10,
		status: 'ACTIVE',
	});
	const { CreateDelivery } = useCreateDelivery();
	const [isManualRefreshing, setIsManualRefreshing] = useState(false);

	const snapPoints = useMemo(() => ['100%'], []);

	const transformedDeliveries = useMemo(() => {
		if (!ListDeliveriesFilter.data?.data) return [];

		return ListDeliveriesFilter.data.data.map((delivery) => ({
			...delivery,
			id: delivery.deliveryId,
		}));
	}, [ListDeliveriesFilter.data?.data]);

	const keyExtractor = useCallback((item: { id: number }) => item.id.toString(), []);

	const handleRefresh = useCallback(async () => {
		setIsManualRefreshing(true);

		try {
			await ListDeliveriesFilter.refetch();
		} catch (error) {
			console.error('❌ Error refreshing deliveries:', error);
		} finally {
			setIsManualRefreshing(false);
		}
	}, []);

	const renderItem = useCallback(
		({ item }: { item: Delivery }) => {
			const progressValuePercentaje = (() => {
				if (item.cleaningStatus === 'PENDING')
					return {
						value: 0,
						name: 'Servicio pendiente',
					};
				if (item.cleaningStatus === 'IN_PROGRESS')
					return {
						value: 50,
						name: 'Esperando proceso de limpieza',
					};
				return {
					value: 100,
					name: 'Completado',
				};
			})();

			return (
				<View
					style={{
						flex: 1,
					}}>
					<View className='flex-1 p-3 bg-neutral-800 rounded-xl'>
						<View>
							<CustomText
								className='text-neutral-100 lg'
								variantWeight={weight.Medium}>
								{item.clientName}
							</CustomText>
						</View>

						<View className='flex-row justify-between items-center'>
							<CustomText className='text-neutral-500 text-sm'>Delivery #{item.id}</CustomText>
						</View>

						<View className='rounded-xl self-start px-4 py-1 my-3 bg-green-600/20'>
							<CustomText
								className='text-green-500 text-sm capitalize'
								variantWeight={weight.Medium}>
								{item.status}
							</CustomText>
						</View>

						<View className='mb-3'>
							<Progress
								value={progressValuePercentaje.value}
								className='w-full h-2'>
								<ProgressFilledTrack className='h-2 bg-emerald-600' />
							</Progress>

							<CustomText className='text-neutral-300 text-sm mt-1'>
								{progressValuePercentaje.name} {progressValuePercentaje.value}%
							</CustomText>
						</View>

						<View>
							<Pressable
								className='flex-row bg-neutral-950 items-center gap-2 p-3 rounded-xl  justify-center'
								onPress={() =>
									router.push({
										pathname: '/(admin)/(tabs)/service-carpets/[id]',
										params: {
											id: item.id,
										},
									})
								}>
								<Ionicons
									name='create-outline'
									size={20}
									color='white'
								/>
								<CustomText className='text-neutral-100 text-sm'>Editar</CustomText>
							</Pressable>
						</View>
					</View>
				</View>
			);
		},
		[ListDeliveriesFilter.data?.data]
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

	const handleSubmitCreateDelivery = async (values: CreateServiceDelivery, formik: FormikHelpers<CreateServiceDelivery>) => {
		await CreateDelivery.mutateAsync(
			{
				...values,
				phone: `+51${values.phone}`,
			},
			{
				onSuccess: () => {
					formik.resetForm();
					bottomSheetRef.current?.close();
				},
			}
		);
	};

	return (
		<Screen isSafeAreaInsets={false}>
			<View className='flex-1 relative px-4'>
				<FlatList
					data={transformedDeliveries ?? []}
					ItemSeparatorComponent={() => <View className='h-3' />}
					keyExtractor={keyExtractor}
					horizontal={false}
					renderItem={renderItem}
					refreshControl={
						<RefreshControl
							refreshing={isManualRefreshing}
							onRefresh={handleRefresh}
							colors={['#10b981']}
							tintColor='#10b981'
						/>
					}
				/>

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
							Crear Delivery
						</CustomText>
					</Button>
				</View>

				<BottomSheet
					ref={bottomSheetRef}
					index={-1}
					snapPoints={snapPoints}
					enablePanDownToClose={true}
					handleIndicatorStyle={{ backgroundColor: '#fff' }}
					backgroundStyle={{ backgroundColor: '#171717' }}
					enableContentPanningGesture={true}
					enableHandlePanningGesture={true}
					enableDynamicSizing={true}
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
									initialValues={initialValues}
									validationSchema={validationCreateDelivery}
									onSubmit={handleSubmitCreateDelivery}>
									{({ values, handleChange, handleBlur, handleSubmit, errors, touched, setFieldValue }) => (
										<View>
											<View className='mb-2'>
												<Input
													label='Nombre cliente'
													placeholder='Ingresar nombre cliente'
													value={values.clientName}
													onChangeText={handleChange('clientName')}
													onFocus={() => bottomSheetRef.current?.expand()}
													name='clientName'
													onBlur={handleBlur('clientName')}
													error={!!(touched.clientName && errors.clientName)}
												/>
											</View>

											<View className='mb-3'>
												<Input
													label='Precio'
													placeholder='Ingresar precio'
													value={values.price}
													keyboardType='numeric'
													onChangeText={handleChange('price')}
													onFocus={() => bottomSheetRef.current?.expand()}
													name='price'
													onBlur={handleBlur('price')}
													error={!!(touched.price && errors.price)}
												/>
											</View>

											<View className='mb-3'>
												<Input
													label='Celular'
													placeholder='999999999'
													value={values.phone}
													keyboardType='numeric'
													onChangeText={handleChange('phone')}
													onFocus={() => bottomSheetRef.current?.expand()}
													name='phone'
													onBlur={handleBlur('phone')}
													error={!!(touched.phone && errors.phone)}
												/>
											</View>

											<RadioGroup
												value={values.paymentType}
												onChange={(value) => setFieldValue('paymentType', value)}
												className='mb-5'>
												<View className='flex-row justify-between'>
													<Radio value='YAPE'>
														<RadioIndicator>
															<RadioIcon as={CircleIcon} />
														</RadioIndicator>
														<RadioLabel>Yape</RadioLabel>
													</Radio>
													<Radio value='PLIN'>
														<RadioIndicator>
															<RadioIcon as={CircleIcon} />
														</RadioIndicator>
														<RadioLabel>Plin</RadioLabel>
													</Radio>
													<Radio value='CASH'>
														<RadioIndicator>
															<RadioIcon as={CircleIcon} />
														</RadioIndicator>
														<RadioLabel>Efectivo</RadioLabel>
													</Radio>
													<Radio value='TRANSFER'>
														<RadioIndicator>
															<RadioIcon as={CircleIcon} />
														</RadioIndicator>
														<RadioLabel>Trasnferencia</RadioLabel>
													</Radio>
												</View>
											</RadioGroup>

											<Button
												text='Crear servicio'
												isLoading={CreateDelivery.isPending}
												disabled={CreateDelivery.isPending}
												onPress={() => handleSubmit()}
											/>
										</View>
									)}
								</Formik>
							</View>
						</BottomSheetScrollView>
					</KeyboardAvoidingView>
				</BottomSheet>
			</View>
		</Screen>
	);
}
