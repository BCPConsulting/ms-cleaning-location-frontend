import { PropsWithChildren, createContext, useCallback, useMemo, useState } from 'react';
import { LatLng } from 'react-native-maps';

interface Props {
	currentCoordinates: LatLng;
	handleSetCoordinates: (latitude: number, longitude: number) => void;
}

export const MapViewContextApi = createContext({} as Props);

export default function MapViewContext({ children }: PropsWithChildren) {
	const [currentCoordinates, setCurrentCoordinates] = useState<LatLng>({
		latitude: -12.0464, // Lima, Perú
		longitude: -77.0428,
	});

	const handleSetCoordinates = useCallback((latitude: number, longitude: number) => {
		setCurrentCoordinates({
			latitude,
			longitude,
		});
	}, []);

	const values = useMemo(
		() => ({
			currentCoordinates,
			handleSetCoordinates,
		}),
		[currentCoordinates, handleSetCoordinates]
	);

	return <MapViewContextApi value={values}>{children}</MapViewContextApi>;
}
