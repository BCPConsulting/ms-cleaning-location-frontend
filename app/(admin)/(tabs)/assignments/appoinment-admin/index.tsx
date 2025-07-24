import { useMemo } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, TouchableWithoutFeedback, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Button from '@/components/ui/button';
import ButtonBack from '@/components/ui/button-back';
import { CustomText, weight } from '@/components/ui/custom-text';
import { Screen } from '@/components/ui/screen';
import { formatISOToDate } from '@/utils/format-iso-to-date';
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
import {
	Actionsheet,
	ActionsheetContent,
	ActionsheetDragIndicator,
	ActionsheetDragIndicatorWrapper,
	ActionsheetBackdrop,
} from '@/components/ui/actionsheet';
import { useToast } from '@/hooks/use-toast';
import { ChevronDownIcon } from '@/components/ui/icon';
import { useGetAllCleaners } from '@/presentation/user/hooks/use-get-all-cleaners';
import { useAssignmentCleaner } from '@/presentation/appoinment/hooks/use-assignment-cleaner';
import { useUpdateAppoinment } from '@/presentation/appoinment/hooks/use-update-appoinment';
import Input from '@/components/ui/input';
import { Ionicons } from '@expo/vector-icons';
import { useDisclose } from '@/hooks/use-disclose';
import CalendarWheel from '@/components/ui/calendar-wheel';
import { Formik, FormikHelpers } from 'formik';
import validationUpdateAppoinment from '@/presentation/appoinment/validation/update-service-validation';

interface InitialValuesUpdate {
	dateTime: string;
	clientName: string;
	locationName: string;
	locationReference: string;
	coordinates: string;
	price: string;
	detail: string;
	cleanerId: string;
}

export default function AssignmentIdCleaner() {
	const {
		id,
		dateTime,
		assignmentStatus,
		cleanerId,
		detail,
		cleaningStatus,
		price,
		locationName,
		locationReference,
		clientName,
		coordinates,
	} = useLocalSearchParams();
	const [isOpen, onOpen, onClose] = useDisclose();
	const { toastError } = useToast();
	const { GetCleaners } = useGetAllCleaners();
	// const { AssignmentCleaner } = useAssignmentCleaner();
	const { UpdateAppoinment } = useUpdateAppoinment();
	const initialValues: InitialValuesUpdate = useMemo(() => {
		return {
			dateTime: dateTime as string,
			clientName: clientName as string,
			locationName: locationName as string,
			locationReference: locationReference as string,
			coordinates: coordinates as string,
			price: price as string,
			detail: detail as string,
			cleanerId: cleanerId as string,
		};
	}, []);

	const handleUpdateAppoinment = async (values: InitialValuesUpdate, formik: FormikHelpers<InitialValuesUpdate>) => {
		UpdateAppoinment.mutate({
			appoinmentId: +id,
			dateTime: values.dateTime,
			clientName: values.clientName,
			locationName: values.locationName,
			locationReference: values.locationReference,
			coordinates: values.coordinates,
			price: +values.price,
			detail: values.detail,
			cleanerId: +values.cleanerId,
		});
	};

	const selectedCleaner = GetCleaners.data?.data.find((cleaner) => cleaner.id === +cleanerId);

	return (
		<Screen>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<ScrollView className='px-4'>
						<View className='flex-row items-center mb-4'>
							<ButtonBack />
							<CustomText
								className='text-2xl px-4 text-neutral-100'
								variantWeight={weight.SemiBold}>
								Detalles del servicio
							</CustomText>
						</View>

						<View className='flex-row items-center justify-between'>
							<CustomText className='text-neutral-200'>#{id}</CustomText>

							<View
								className={`${
									cleaningStatus === 'PENDING' ? 'bg-warning/10' : 'bg-secondary/20'
								} rounded-3xl px-3 py-2 self-start`}>
								<CustomText
									className={`text-sm ${cleaningStatus === 'PENDING' ? 'text-warning' : 'text-secondary'}`}
									variantWeight={weight.Medium}>
									{cleaningStatus === 'PENDING' ? 'Pendiente' : cleaningStatus === 'IN_PROGRESS' && 'En Progreso'}
								</CustomText>
							</View>
						</View>

						<Formik
							initialValues={initialValues}
							validationSchema={validationUpdateAppoinment}
							onSubmit={(values, formik) => handleUpdateAppoinment(values, formik)}>
							{({ values, handleChange, handleBlur, handleSubmit, setFieldValue, touched, errors }) => (
								<View>
									<View className='mb-3'>
										<Input
											label='Nombre cliente'
											value={values.clientName}
											onChangeText={handleChange('clientName')}
											onBlur={handleBlur('clientName')}
											placeholder='Ingresar nombre cliente'
											multiline
											error={!!(touched.clientName && errors.clientName)}
											name='clientName'
										/>
									</View>

									<View className='mb-3'>
										<Input
											label='Lugar'
											value={values.locationName}
											onChangeText={handleChange('locationName')}
											onBlur={handleBlur('locationName')}
											placeholder='Ingresar nombre lugar'
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
											onBlur={handleBlur(`locationReference`)}
											placeholder='Ingresar referencia'
											multiline
											error={!!(touched.locationReference && errors.locationReference)}
											name='locationReference'
										/>
									</View>

									<View className='mb-3'>
										<Input
											label='Precio'
											value={values.price}
											onChangeText={handleChange('price')}
											onBlur={handleBlur(`price`)}
											placeholder='Ingresar precio'
											keyboardType='numeric'
											multiline
											error={!!(touched.price && errors.price)}
											name='price'
										/>
									</View>

									<View className='mb-3'>
										<Input
											label='Detalles'
											value={values.detail as string}
											onChangeText={handleChange('detail')}
											multiline
											placeholder='Ingresar Detalles'
										/>
									</View>

									<View className='mb-3'>
										<CustomText className='text-[#d4d4d4] text-sm mb-1'>Asignar operario</CustomText>

										<Select
											selectedValue={cleanerId?.toString()}
											defaultValue={cleanerId?.toString()}
											initialLabel={selectedCleaner?.username}
											// onValueChange={(cleanerId) =>
											// 	AssignmentCleaner.mutate({
											// 		cleanerId: +cleanerId,
											// 		appoinmentId: +id,
											// 	})
											// }
										>
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

									<View className='mb-3'>
										<CustomText className='text-[#d4d4d4] mb-2'>Fecha</CustomText>
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
											onPress={() => onOpen()}>
											<Ionicons
												name='calendar-outline'
												size={20}
												color='#d4d4d4'
											/>
											<View className='flex-row items-cemter flex-1'>
												<CustomText
													variantWeight={weight.Medium}
													className='text-neutral-300 text-sm'>
													{formatISOToDate(values.dateTime)}
												</CustomText>
											</View>
										</Pressable>
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
														setFieldValue('dateTime', value.date);

														onClose();
													}}
												/>
											</View>
										</ActionsheetContent>
									</Actionsheet>

									<Button
										text='Actualizar servicio'
										className='mb-3'
										isLoading={UpdateAppoinment.isPending}
										disabled={UpdateAppoinment.isPending}
										onPress={() => handleSubmit()}
									/>
								</View>
							)}
						</Formik>
					</ScrollView>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView>
		</Screen>
	);
}
