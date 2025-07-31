import { useCallback, useRef, useState } from 'react';
import { View, Pressable } from 'react-native';
import MapView, { LatLng } from 'react-native-maps';
import { useNavigation } from 'expo-router';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import GooglePlacesTextInput, { Place } from 'react-native-google-places-textinput';
import { Screen } from '@/components/ui/screen';
import { CreateApppointmentRequest } from '@/core/appointment/interfaces';
import { DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import MapViewCarpets from '@/presentation/admin/create-service/components/MapViewCarpets';
import { LogisticEvent } from '@/core/logistic-event/interfaces';

const initialValue: CreateApppointmentRequest = {
	coordinates: '',
	detail: '',
	price: 0,
	clientName: '',
	locationName: '',
	locationReference: '',
	cel: '',
};

export default function ServiceCarpetsScreen() {
	const bottomSheetDetailsRef = useRef<BottomSheet>(null);
	const [currentCoordinates, setCurrentCoordinates] = useState<LatLng>({
		latitude: -12.0464, // Lima, Perú
		longitude: -77.0428,
	});
	const mapRef = useRef<MapView>(null);
	const navigation = useNavigation();

	const openDrawer = useCallback(() => {
		navigation.dispatch(DrawerActions.openDrawer());
	}, []);

	const openBottomSheetDetails = useCallback((logistc: LogisticEvent) => {
		bottomSheetDetailsRef.current?.expand();
		console.log('logistc', JSON.stringify(logistc, null, 2));
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

	const handleSetCoordinates = useCallback((latitude: number, longitude: number) => {
		setCurrentCoordinates({
			latitude,
			longitude,
		});
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

			<MapViewCarpets
				mapRef={mapRef}
				currentCoordinates={currentCoordinates}
				handleSetCoordinates={handleSetCoordinates}
				openBottomSheetDetails={openBottomSheetDetails}
			/>
		</Screen>
	);
}
