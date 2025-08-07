import { memo, useMemo } from 'react';
import { Dimensions, Pressable, View } from 'react-native';
import MapView, { LatLng, Marker, MarkerAnimated, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { useQueryClient } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/spinner';
import { AssignmentAdminResponse } from '@/core/appointment/interfaces';
import { useListAssignmentsAdmin } from '@/presentation/appoinment/hooks/use-list-assignments-admin';
import { useGetAllCleaners } from '@/presentation/user/hooks/use-get-all-cleaners';
import { Ionicons } from '@expo/vector-icons';

const car = require('@/assets/images/minivan 3.png');

const dimensions = Dimensions.get('screen');

interface Props {
	currentCoordinates: LatLng;
	handleSetCoordinates: (latitude: number, longitude: number) => void;
	mapRef: React.RefObject<MapView | null>;
	openBottomSheetDetails: (appoinment: AssignmentAdminResponse) => void;
	searchMarker: LatLng | null;
}

const parseCoordinates = (coordinates: string | null | undefined): { latitude: number; longitude: number } | null => {
	if (!coordinates || coordinates.trim() === '' || coordinates === 'null') {
		return null;
	}

	try {
		const parts = coordinates.split(',');

		if (parts.length !== 2) {
			return null;
		}

		const latitude = parseFloat(parts[0].trim());
		const longitude = parseFloat(parts[1].trim());

		if (isNaN(latitude) || isNaN(longitude)) {
			return null;
		}

		return { latitude, longitude };
	} catch (error) {
		console.error('Error parsing coordinates:', coordinates, error);
		return null;
	}
};

const MapViewAdmin = memo(({ currentCoordinates, handleSetCoordinates, mapRef, openBottomSheetDetails, searchMarker }: Props) => {
	const defaultDate = useMemo(() => new Date(), []);
	const { ListAssignmentsAdmin } = useListAssignmentsAdmin({
		from: defaultDate,
		to: defaultDate,
		pageNumber: 1,
		pageSize: 10000,
		cleaningStatus: 'PENDING',
	});
	const { GetCleaners } = useGetAllCleaners();
	const queryClient = useQueryClient();

	const onRegionChangeComplete = (region: Region) => {
		const latitudeDelta = region.latitudeDelta;
		const offsetPercent = 0.3; // 30% hacia arriba (50% - 20% = 30%)
		const adjustedLatitude = region.latitude + latitudeDelta * offsetPercent;

		handleSetCoordinates(adjustedLatitude, region.longitude);
	};

	const appointmentsWithCoordinates = useMemo(() => {
		if (!ListAssignmentsAdmin.data?.data) return [];

		return ListAssignmentsAdmin.data.data.filter((appointment) => {
			return parseCoordinates(appointment.coordinates) !== null;
		});
	}, [ListAssignmentsAdmin.data?.data]);

	const cleanersWithCoordinates = useMemo(() => {
		if (!GetCleaners.data?.data) return [];

		return GetCleaners.data.data.filter((cleaner) => {
			return parseCoordinates(cleaner.coordinates) !== null;
		});
	}, [GetCleaners.data?.data]);

	if (ListAssignmentsAdmin.isPending || GetCleaners.isPending) {
		return (
			<View className='flex-1 justify-center items-center'>
				<Spinner size={'large'} />
			</View>
		);
	}

	return (
		<View
			className='flex-1 relative'
			style={{
				height: dimensions.height * 0.8, // 80% de la pantalla
				width: dimensions.width,
			}}>
			<MapView
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
				}} // Llenar todo el contenedor
				initialRegion={{
					latitude: currentCoordinates?.latitude,
					longitude: currentCoordinates?.longitude,
					latitudeDelta: 0.1,
					longitudeDelta: 0.1,
				}}
				userInterfaceStyle='dark'
				initialCamera={{
					center: { latitude: currentCoordinates?.latitude, longitude: currentCoordinates?.longitude },
					zoom: 10,
					pitch: 0,
					heading: 0,
					altitude: 0,
				}}
				showsUserLocation={true}
				provider={PROVIDER_GOOGLE}
				// showsMyLocationButton={true}
				ref={mapRef}
				onRegionChangeComplete={(region) => onRegionChangeComplete(region)}>
				{cleanersWithCoordinates.map((cleaner) => (
					<MarkerAnimated
						key={cleaner.id}
						coordinate={{
							latitude: +cleaner.coordinates.split(',')[0],
							longitude: +cleaner.coordinates.split(',')[1],
						}}
						image={car}
						style={{
							width: 10,
							height: 10,
						}}
						title={`${cleaner.username}`}
					/>
				))}
				{appointmentsWithCoordinates.map((appoinment) => (
					<MarkerAnimated
						key={appoinment.id}
						onPress={() => openBottomSheetDetails(appoinment)}
						coordinate={{
							latitude: +appoinment.coordinates.split(',')[0],
							longitude: +appoinment.coordinates.split(',')[1],
						}}
						style={{
							width: 10,
							height: 10,
						}}
						title={`${appoinment.clientName}`}
					/>
				))}

				{searchMarker && (
					<Marker
						coordinate={searchMarker}
						pinColor='blue'
						title='Ubicación buscada'
						description='Resultado de búsqueda'
					/>
				)}
			</MapView>

			<View
				className='absolute left-1/2 items-center justify-center'
				style={{
					top: '20%', // 40% del CONTENEDOR del mapa, no de la pantalla
					marginLeft: -12,
					marginTop: -24,
				}}
				pointerEvents='none'>
				<View className='w-6 h-6 items-center justify-center'>
					<View
						className='w-5 h-5 bg-primary rounded-full border-2 border-white shadow-lg'
						style={{
							shadowColor: '#000',
							shadowOffset: { width: 0, height: 2 },
							shadowOpacity: 0.25,
							shadowRadius: 3.84,
							elevation: 5,
						}}
					/>
				</View>
			</View>

			<Pressable
				onPress={() => queryClient.invalidateQueries({ queryKey: ['get-all-cleaners'] })}
				className='absolute top-24 right-4 bg-white/90 p-2'
				style={{
					shadowColor: '#000',
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.25,
					shadowRadius: 3.84,
					elevation: 5,
				}}>
				<Ionicons
					name={GetCleaners.isFetching ? 'reload' : 'reload-circle-outline'}
					size={24}
					color='#656565'
				/>
			</Pressable>
		</View>
	);
});

export default MapViewAdmin;
