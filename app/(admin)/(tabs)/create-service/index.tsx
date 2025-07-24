import { useCallback, useMemo, useRef, useState } from 'react';
import { Platform, View, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native';
import { Formik, FormikHelpers } from 'formik';
import MapView, { LatLng } from 'react-native-maps';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import GooglePlacesTextInput, { Place } from 'react-native-google-places-textinput';
import { Screen } from '@/components/ui/screen';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useCreateAppointment } from '@/presentation/appoinment/hooks/use-create-appointment';
import { CreateApppointmentRequest } from '@/core/appointment/interfaces';
import MapViewAdmin from '@/presentation/admin/create-service/components/MapViewAdmin';
import { useKeyboard } from '@/hooks/use-key-board';

const initialValue: CreateApppointmentRequest = {
	coordinates: '',
	detail: '',
	price: 0,
	clientName: '',
	locationName: '',
	locationReference: '',
};

export default function CreateServiceScreen() {
	const { CreateAppointment } = useCreateAppointment();
	const bottomSheetRef = useRef<BottomSheet>(null);
	const mapRef = useRef<MapView>(null);
	const { isKeyboardVisible, dismissKeyboard } = useKeyboard();
	const [currentIndex, setCurrentIndex] = useState(1);
	const [currentCoordinates, setCurrentCoordinates] = useState<LatLng>({
		latitude: -12.0464, // Lima, Perú
		longitude: -77.0428,
	});

	const snapPoints = useMemo(() => ['17%', '30%', '50%', '70%', '100%'], []);

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
		});

		formik.resetForm();
	};

	const handleSetCoordinates = useCallback((latitude: number, longitude: number) => {
		setCurrentCoordinates({
			latitude,
			longitude,
		});
	}, []);

	const renderBackdrop = useCallback(
		(props: any) => (
			<BottomSheetBackdrop
				{...props}
				disappearsOnIndex={0}
				appearsOnIndex={0}
				pressBehavior={'none'}
				opacity={0.5}
			/>
		),
		[]
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

	return (
		<Screen>
			<View className='px-3'>
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
						},
					}}
				/>
			</View>

			<MapViewAdmin
				mapRef={mapRef}
				currentCoordinates={currentCoordinates}
				handleSetCoordinates={handleSetCoordinates}
			/>

			<TouchableWithoutFeedback
				onPress={Keyboard.dismiss}
				style={{
					position: 'relative',
					zIndex: 100,
				}}>
				<BottomSheet
					ref={bottomSheetRef}
					index={1}
					snapPoints={snapPoints}
					enablePanDownToClose={false}
					handleIndicatorStyle={{ backgroundColor: '#fff' }}
					backgroundStyle={{ backgroundColor: '#262626' }}
					onChange={handleSheetChanges}
					enableContentPanningGesture={false}
					enableDynamicSizing={false}
					keyboardBehavior='fillParent'>
					<KeyboardAvoidingView
						style={{ flex: 1 }}
						behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
						<BottomSheetScrollView style={{ backgroundColor: '#262626', position: 'relative', padding: 12 }}>
							<Formik
								initialValues={initialValue}
								onSubmit={(values, formik) => handleCreateService(values, formik)}>
								{({ values, handleSubmit, handleChange, setFieldValue }) => (
									<View>
										<View>
											<Input
												label='Nombre cliente'
												placeholder='Ingresar nombre cliente'
												value={values.clientName}
												onChangeText={handleChange('clientName')}
												onFocus={() => bottomSheetRef.current?.expand()}
											/>
										</View>

										<View>
											<Input
												label='Lugar de ubicación'
												placeholder='Ingresar lugar de ubicación'
												value={values.locationName}
												onChangeText={handleChange('locationName')}
												onFocus={() => bottomSheetRef.current?.expand()}
											/>
										</View>

										<View>
											<Input
												label='Referencia de ubicación'
												placeholder='Ingresar referencia de ubicación'
												value={values.locationReference}
												onChangeText={handleChange('locationReference')}
												onFocus={() => bottomSheetRef.current?.expand()}
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
		</Screen>
	);
}
