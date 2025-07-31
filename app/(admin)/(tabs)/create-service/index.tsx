import { useCallback, useMemo, useRef, useState } from 'react';
import { Platform, View, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Pressable } from 'react-native';
import { Formik, FormikHelpers } from 'formik';
import MapView, { LatLng } from 'react-native-maps';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import GooglePlacesTextInput, { Place } from 'react-native-google-places-textinput';
import { Screen } from '@/components/ui/screen';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useCreateAppointment } from '@/presentation/appoinment/hooks/use-create-appointment';
import { AssignmentAdminResponse, CreateApppointmentRequest } from '@/core/appointment/interfaces';
import MapViewAdmin from '@/presentation/admin/create-service/components/MapViewAdmin';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { useKeyboard } from '@/hooks/use-key-board';
import { Ionicons } from '@expo/vector-icons';
import { CustomText, weight } from '@/components/ui/custom-text';
import { statusReturnTypeData } from '@/utils/status-type-return-data';
import validationCreateAppoinment from '@/presentation/appoinment/validation/create-service-validation';
import { useFocusEffect } from 'expo-router';

const initialValue: CreateApppointmentRequest = {
	coordinates: '',
	detail: '',
	price: 0,
	clientName: '',
	locationName: '',
	locationReference: '',
	cel: '',
};

export default function CreateServiceScreen() {
	const { CreateAppointment } = useCreateAppointment();
	const bottomSheetRef = useRef<BottomSheet>(null);
	const bottomSheetDetailsRef = useRef<BottomSheet>(null);
	const [appointment, setAppointment] = useState<AssignmentAdminResponse>({} as AssignmentAdminResponse);
	const { isKeyboardVisible, dismissKeyboard } = useKeyboard();
	const [currentIndex, setCurrentIndex] = useState(1);
	const [currentCoordinates, setCurrentCoordinates] = useState<LatLng>({
		latitude: -12.0464, // Lima, Perú
		longitude: -77.0428,
	});
	const mapRef = useRef<MapView>(null);
	const navigation = useNavigation();

	const snapPoints = useMemo(() => ['17%', '30%', '50%', '88%'], []);

	const openDrawer = useCallback(() => {
		navigation.dispatch(DrawerActions.openDrawer());
	}, []);

	const openBottomSheetDetails = useCallback((appoinment: AssignmentAdminResponse) => {
		bottomSheetDetailsRef.current?.expand();
		setAppointment(appoinment);
	}, []);

	const handlePlaceSelect = useCallback((place: Place) => {
		const location = place.details?.location;

		const coordinates = {
			latitude: location.latitude,
			longitude: location.longitude,
			latitudeDelta: 0.01,
			longitudeDelta: 0.01,
		};

		mapRef.current?.animateToRegion(coordinates);
	}, []);

	const handleCreateService = async (values: CreateApppointmentRequest, formik: FormikHelpers<CreateApppointmentRequest>) => {
		CreateAppointment.mutate({
			coordinates: `${currentCoordinates.latitude},${currentCoordinates.longitude}`,
			detail: values.detail,
			price: values.price,
			clientName: values.clientName,
			locationName: values.locationName,
			locationReference: values.locationReference,
			cel: values.cel,
		});

		formik.resetForm();
	};

	const handleSetCoordinates = useCallback((latitude: number, longitude: number) => {
		setCurrentCoordinates({
			latitude,
			longitude,
		});
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

	const focusHook = useCallback((callback: () => void) => {
		useFocusEffect(callback);
	}, []);

	return (
		<Screen>
			<View className='absolute top-5 z-20 w-full'>
				<View className='flex-row items-center'>
					<View className='bg-neutral-900 p-2 ml-4 self-start rounded-full mt-1'>
						<Pressable onPress={() => openDrawer()}>
							<Ionicons
								name='menu'
								size={24}
								color='white'
							/>
						</Pressable>
					</View>
					<View className='px-4 flex-1'>
						<GooglePlacesTextInput
							apiKey='AIzaSyA7-sRE52W0DluKa4yKqV0AEXtEKLxwiBQ'
							onPlaceSelect={(place) => handlePlaceSelect(place)}
							fetchDetails={true}
							includedRegionCodes={['PE']}
							detailsFields={['addressComponents', 'formattedAddress', 'location', 'viewport', 'types']}
							placeHolderText='Buscar dirección'
							style={{
								input: {
									padding: 8,
									borderRadius: 12,
									marginBottom: 8,
									backgroundColor: '#18181b',
									borderColor: 'transparent',
									color: 'white',
								},
							}}
						/>
					</View>
				</View>
			</View>

			<MapViewAdmin
				mapRef={mapRef}
				currentCoordinates={currentCoordinates}
				handleSetCoordinates={handleSetCoordinates}
				openBottomSheetDetails={openBottomSheetDetails}
			/>

			<View className='absolute bottom-0 w-full px-4 mb-4'>
				<Button
					className=''
					text='Abrir formulario'
					onPress={() => bottomSheetRef.current?.expand()}
				/>
			</View>

			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<BottomSheet
					ref={bottomSheetRef}
					index={-1}
					snapPoints={snapPoints}
					enablePanDownToClose={true}
					handleIndicatorStyle={{ backgroundColor: '#fff' }}
					backgroundStyle={{ backgroundColor: '#262626' }}
					onChange={handleSheetChanges}
					enableContentPanningGesture={true}
					enableHandlePanningGesture={true}
					enableDynamicSizing={false}
					keyboardBehavior='fillParent'>
					<KeyboardAvoidingView
						style={{ flex: 1 }}
						behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
						<BottomSheetScrollView
							style={{ backgroundColor: '#262626', position: 'relative', padding: 12 }}
							focusHook={focusHook}
							nestedScrollEnabled={true}
							contentContainerStyle={{
								paddingBottom: Platform.select({ ios: 300, android: 250 }),
							}}>
							<Formik
								initialValues={initialValue}
								validationSchema={validationCreateAppoinment}
								onSubmit={(values, formik) => handleCreateService(values, formik)}>
								{({ values, handleSubmit, handleChange, handleBlur, touched, errors }) => (
									<View>
										<View>
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

										<View>
											<Input
												label='Celular'
												placeholder='999999999'
												value={values.cel}
												onChangeText={handleChange('cel')}
												onFocus={() => bottomSheetRef.current?.expand()}
												name='cel'
												onBlur={handleBlur('cel')}
												error={!!(touched.cel && errors.cel)}
											/>
										</View>

										<View>
											<Input
												label='Lugar de ubicación'
												placeholder='Ingresar lugar de ubicación'
												value={values.locationName}
												onChangeText={handleChange('locationName')}
												onFocus={() => bottomSheetRef.current?.expand()}
												name='locationName'
												onBlur={handleBlur('locationName')}
												error={!!(touched.locationName && errors.locationName)}
											/>
										</View>

										<View>
											<Input
												label='Referencia de ubicación'
												placeholder='Ingresar referencia de ubicación'
												value={values.locationReference}
												onChangeText={handleChange('locationReference')}
												onFocus={() => bottomSheetRef.current?.expand()}
												name='locationReference'
												onBlur={handleBlur('locationReference')}
												error={!!(touched.locationReference && errors.locationReference)}
											/>
										</View>

										<View>
											<Input
												label='Precio'
												placeholder='Ingresar precio'
												value={values.price.toString()}
												onChangeText={handleChange('price')}
												onFocus={() => bottomSheetRef.current?.expand()}
												keyboardType='numeric'
												name='price'
												onBlur={handleBlur('price')}
												error={!!(touched.price && errors.price)}
											/>
										</View>

										<View className='mb-4'>
											<Input
												label='Detalles'
												placeholder='Ingresar detalles'
												value={values.detail}
												onChangeText={handleChange('detail')}
												onFocus={() => bottomSheetRef.current?.expand()}
												multiline
												name='detail'
												onBlur={handleBlur('detail')}
												error={!!(touched.detail && errors.detail)}
											/>
										</View>

										<Button
											text='Crear servicio'
											disabled={CreateAppointment.isPending}
											isLoading={CreateAppointment.isPending}
											className='mb-5'
											onPress={() => handleSubmit()}
										/>
									</View>
								)}
							</Formik>
						</BottomSheetScrollView>
					</KeyboardAvoidingView>
				</BottomSheet>
			</TouchableWithoutFeedback>

			<BottomSheet
				ref={bottomSheetDetailsRef}
				index={-1}
				snapPoints={snapPoints}
				enablePanDownToClose={true}
				handleIndicatorStyle={{ backgroundColor: '#fff' }}
				backgroundStyle={{ backgroundColor: '#262626' }}
				onChange={handleSheetChanges}
				enableDynamicSizing={false}
				keyboardBehavior='fillParent'>
				<BottomSheetScrollView style={{ backgroundColor: '#262626', position: 'relative', padding: 12 }}>
					<CustomText
						className='text-xl text-neutral-100 mb-4'
						variantWeight={weight.Medium}>
						Datos del servicio
					</CustomText>

					<View className='mb-3'>
						<CustomText className='text-neutral-400 text-sm'>Nombre Cliente:</CustomText>
						<CustomText className='text-neutral-100'>{appointment.clientName}</CustomText>
					</View>

					<View className='mb-3'>
						<CustomText className='text-neutral-400 text-sm'>Nombre celular:</CustomText>
						<CustomText className='text-neutral-100'>{appointment.cel}</CustomText>
					</View>

					<View className='mb-3'>
						<CustomText className='text-neutral-400 text-sm'>Detalles:</CustomText>
						<CustomText className='text-neutral-100'>{appointment.detail}</CustomText>
					</View>

					<View className='mb-3'>
						<CustomText className='text-neutral-400 text-sm'>Nombre del lugar:</CustomText>
						<CustomText className='text-neutral-100'>{appointment.locationName}</CustomText>
					</View>

					<View className='mb-3'>
						<CustomText className='text-neutral-400 text-sm'>Lugar de referencia:</CustomText>
						<CustomText className='text-neutral-100'>{appointment.locationReference}</CustomText>
					</View>

					<View className='mb-3'>
						<CustomText className='text-neutral-400 text-sm'>Asignado:</CustomText>
						<CustomText className='text-neutral-100'>{appointment.cleanner?.username}</CustomText>
					</View>

					<View className='mb-3'>
						<CustomText className='text-neutral-400 text-sm'>Estado:</CustomText>
						<CustomText className='text-neutral-100'>{statusReturnTypeData(appointment.cleaningStatus)}</CustomText>
					</View>
				</BottomSheetScrollView>
			</BottomSheet>
		</Screen>
	);
}
