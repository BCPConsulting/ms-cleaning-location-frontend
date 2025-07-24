import Button from '@/components/ui/button';
import { CustomText } from '@/components/ui/custom-text';
import { Spinner } from '@/components/ui/spinner';
import { useListAssignmentsAdmin } from '@/presentation/appoinment/hooks/use-list-assignments-admin';
import { useGetAllCleaners } from '@/presentation/user/hooks/use-get-all-cleaners';
import { formatISOToDate } from '@/utils/format-iso-to-date';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { memo, useMemo, useRef, useState } from 'react';
import { Dimensions, Pressable, View } from 'react-native';
import MapView, { LatLng, MarkerAnimated, PROVIDER_GOOGLE, Region } from 'react-native-maps';

const car = require('@/assets/images/minivan 3.png');

const dimensions = Dimensions.get('screen');

interface Props {
	currentCoordinates: LatLng;
	handleSetCoordinates: (latitude: number, longitude: number) => void;
	mapRef: React.RefObject<MapView | null>;
}

const MapViewAdmin = memo(({ currentCoordinates, handleSetCoordinates, mapRef }: Props) => {
	const defaultDate = useMemo(() => new Date(), []);
	const { ListAssignmentsAdmin } = useListAssignmentsAdmin({
		from: defaultDate,
		to: defaultDate,
		pageNumber: 1,
		pageSize: 10000,
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
			return appointment.coordinates && appointment.coordinates.trim() !== '' && appointment.coordinates !== 'null';
		});
	}, [ListAssignmentsAdmin.data?.data]);

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
					latitude: currentCoordinates.latitude,
					longitude: currentCoordinates.longitude,
					latitudeDelta: 0.1,
					longitudeDelta: 0.1,
				}}
				userInterfaceStyle='dark'
				initialCamera={{
					center: { latitude: currentCoordinates.latitude, longitude: currentCoordinates.longitude },
					zoom: 10,
					pitch: 0,
					heading: 0,
					altitude: 0,
				}}
				showsUserLocation={true}
				provider={PROVIDER_GOOGLE}
				showsMyLocationButton={true}
				ref={mapRef}
				onRegionChangeComplete={(region) => onRegionChangeComplete(region)}>
				{GetCleaners.data?.data.map((cleaner) => (
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
						coordinate={{
							latitude: +appoinment.coordinates.split(',')[0],
							longitude: +appoinment.coordinates.split(',')[1],
						}}
						style={{
							width: 10,
							height: 10,
						}}
						title={`${formatISOToDate(appoinment.dateTime, true)}`}
					/>
				))}
			</MapView>

			{/* Pin fijo - AHORA relativo al contenedor del mapa */}
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

			<View
				className='absolute top-3 left-5 bg-white/90 p-3 rounded-2xl'
				style={{
					shadowColor: '#000',
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.25,
					shadowRadius: 3.84,
					elevation: 5,
				}}>
				<CustomText className='text-xs text-gray-700 font-mono'>Lat: {currentCoordinates.latitude.toFixed(4)}</CustomText>
				<CustomText className='text-xs text-gray-700 font-mono'>Lng: {currentCoordinates.longitude.toFixed(4)}</CustomText>
			</View>

			<Pressable
				onPress={() => queryClient.invalidateQueries({ queryKey: ['get-all-cleaners'] })}
				className='absolute top-16 right-3.5 bg-white/90 p-2'
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
