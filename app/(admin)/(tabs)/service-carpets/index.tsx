import { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, RefreshControl, View } from 'react-native';
import { router } from 'expo-router';
import { Formik, FormikHelpers, FormikValues } from 'formik';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { CustomText, weight } from '@/components/ui/custom-text';
import { Screen } from '@/components/ui/screen';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { Radio, RadioGroup, RadioIndicator, RadioLabel, RadioIcon } from '@/components/ui/radio';
import { CircleIcon } from '@/components/ui/icon';
import { useKeyboard } from '@/hooks/use-key-board';
import { CreateServiceDelivery, Delivery } from '@/core/delivery/interfaces';
import { paymentTypeReturnData } from '@/utils/payment-type-return-data';
import validationCreateDelivery from '@/presentation/delivery/validation/create-delivery-validation';
import { useCreateDelivery } from '@/presentation/delivery/hooks/use-create-delivery';
import { useListDeliveryFilter } from '@/presentation/delivery/hooks/use-list-delivery-filter';

const initialValues: CreateServiceDelivery = {
	price: '',
	paymentType: 'YAPE',
	clientName: '',
	cleaningStatus: 'PENDING',
	status: 'ACTIVE',
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

	const renderItem = useCallback(({ item }: { item: Delivery }) => {
		return (
			<>
				<Pressable
					style={{
						flex: 1,
						// height: 100,
					}}
					onPress={() =>
						router.push({
							pathname: '/(admin)/(tabs)/service-carpets/[id]',
							params: {
								id: item.id,
							},
						})
					}>
					<View className='w-full flex-1 bg-neutral-800'>
						<View className='p-4 bg-neutral-800 rounded-xl'>
							<View className='flex-row justify-between items-center'>
								<CustomText className='text-neutral-200'>#{item.id}</CustomText>

								<View
									className='rounded-full self-start px-2 py-1 mt-2'
									style={{
										backgroundColor: paymentTypeReturnData(item.paymentType).color,
									}}>
									<CustomText className='text-neutral-100'>{paymentTypeReturnData(item.paymentType).name}</CustomText>
								</View>
							</View>
							<View>
								<CustomText
									className='text-neutral-100'
									variantWeight={weight.Medium}>
									{item.clientName}
								</CustomText>
							</View>

							<View>
								<CustomText
									className='text-neutral-100'
									variantWeight={weight.Medium}>
									{item.price}
								</CustomText>
							</View>
						</View>
					</View>
				</Pressable>
			</>
		);
	}, []);

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
		await CreateDelivery.mutateAsync(values, {
			onSuccess: () => {
				formik.resetForm();
				bottomSheetRef.current?.close();
			},
		});
	};

	return (
		<Screen>
			<View className='flex-1 px-4 relative'>
				<FlatList
					data={transformedDeliveries ?? []}
					ItemSeparatorComponent={() => <View className='h-3' />}
					keyExtractor={keyExtractor}
					renderItem={renderItem}
					refreshControl={
						<RefreshControl
							refreshing={isManualRefreshing}
							onRefresh={handleRefresh}
							colors={['#10b981']} // Verde en Android
							tintColor='#10b981' // Verde en iOS
						/>
					}
				/>

				<View className='w-full py-4'>
					<Button
						text='Crear Delivery'
						onPress={() => bottomSheetRef.current?.expand()}
					/>
				</View>

				<BottomSheet
					ref={bottomSheetRef}
					index={-1}
					snapPoints={snapPoints}
					enablePanDownToClose={true}
					handleIndicatorStyle={{ backgroundColor: '#fff' }}
					backgroundStyle={{ backgroundColor: '#262626' }}
					enableContentPanningGesture={true}
					enableHandlePanningGesture={true}
					enableDynamicSizing={false}
					onChange={handleSheetChanges}
					keyboardBehavior='fillParent'>
					<KeyboardAvoidingView
						style={{ flex: 1 }}
						behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
						<BottomSheetScrollView
							style={{ backgroundColor: '#262626', position: 'relative', padding: 12 }}
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
