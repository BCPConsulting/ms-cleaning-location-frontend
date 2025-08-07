import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { View } from 'react-native';
import WheelPicker from '@quidone/react-native-wheel-picker';
import { DateItemType, WheelDatePickerProps, WheelPickerChangeEvent } from './interfaces';
import Button from '../button';
import { CustomText, weight } from '../custom-text';

export default function CalendarWheel({
	initialDate,
	onSubmit = () => {},
	showLabel = true,
	title,
	titleButton = 'Guardar Fecha',
}: WheelDatePickerProps) {
	const monthNames = useMemo(
		() => [
			'Enero',
			'Febrero',
			'Marzo',
			'Abril',
			'Mayo',
			'Junio',
			'Julio',
			'Agosto',
			'Setiembre',
			'Octubre',
			'Noviembre',
			'Diciembre',
		],
		[]
	);

	const currentYear = useMemo(() => new Date().getFullYear(), []);
	const defaultDate = useMemo(() => new Date(), []);
	const dateToUse = initialDate || defaultDate;

	const yearsData = useMemo(
		(): DateItemType[] =>
			Array.from({ length: 100 }, (_, i) => ({
				value: currentYear - i,
				label: String(currentYear - i),
			})),
		[currentYear]
	);

	const [userSelectedDay, setUserSelectedDay] = useState<number>(dateToUse.getDate());
	const [selectedMonth, setSelectedMonth] = useState<number>(dateToUse.getMonth());
	const [selectedYear, setSelectedYear] = useState<number>(dateToUse.getFullYear());
	const isInitialDateProvided = useRef<boolean>(initialDate !== undefined);

	const daysData = useMemo((): DateItemType[] => {
		const numDays = new Date(selectedYear, selectedMonth + 1, 0).getDate();
		return Array.from({ length: numDays }, (_, i) => ({
			value: i + 1,
			label: String(i + 1),
		}));
	}, [selectedMonth, selectedYear]);

	const effectiveDay = useMemo(() => Math.min(userSelectedDay, daysData.length), [userSelectedDay, daysData.length]);

	const handleDayChange = useCallback((event: WheelPickerChangeEvent) => {
		setUserSelectedDay(event.item.value);
	}, []);

	const handleMonthChange = useCallback((event: WheelPickerChangeEvent) => {
		setSelectedMonth(event.item.value);
	}, []);

	const handleYearChange = useCallback((event: WheelPickerChangeEvent) => {
		setSelectedYear(event.item.value);
	}, []);

	const monthsData = useMemo((): DateItemType[] => monthNames.map((m, i) => ({ value: i, label: m })), [monthNames]);

	const handleSubmit = () => {
		// Llamamos a la función externa con el mes seleccionado
		if (onSubmit) {
			const selectedDate = new Date(selectedYear, selectedMonth, effectiveDay);

			onSubmit({
				date: selectedDate,
				formatted: `${selectedYear}-${selectedMonth + 1}-${effectiveDay}`,
				formattedReversedSlash: `${effectiveDay}/${selectedMonth + 1}/${selectedYear}`,
				day: effectiveDay,
				month: selectedMonth,
				monthName: monthNames[selectedMonth],
				year: selectedYear,
			});
		}
	};

	useEffect(() => {
		if (initialDate && isInitialDateProvided.current) {
			setUserSelectedDay(initialDate.getDate());
			setSelectedMonth(initialDate.getMonth());
			setSelectedYear(initialDate.getFullYear());
		}
	}, [initialDate]);

	return (
		<View className=''>
			{showLabel && (
				<CustomText
					className='px-3 text-xl text-neutral-200'
					variantWeight={weight.Medium}>
					{title}
				</CustomText>
			)}
			<View className='w-full flex-row justify-between'>
				{/* Día */}
				<View className='relative flex-1 items-center'>
					{/* <View
						className='absolute h-14 w-full rounded-l-md border-y-2 border-[#FF9848]'
						style={{
							zIndex: -1,
							top: '50%',
							transform: [{ translateY: -(50 / 2) }],
							opacity: 0.75,
						}}
					/> */}

					<WheelPicker
						data={daysData}
						value={effectiveDay}
						onValueChanged={handleDayChange}
						itemTextStyle={{
							color: '#ffffff',
							fontSize: 20,
							paddingHorizontal: 15,
						}}
						overlayItemStyle={{
							backgroundColor: 'transparent',
							//   borderTopWidth: 4,
							borderRadius: 0,
							//   borderBottomWidth: 4,
							borderColor: '#FF9848',
							opacity: 1,
						}}
					/>
				</View>
				{/* Mes */}
				<View className='relative flex-1 items-center'>
					<WheelPicker
						data={monthsData}
						value={selectedMonth}
						onValueChanged={handleMonthChange}
						itemTextStyle={{
							color: '#ffffff',
							fontSize: 20,
						}}
						overlayItemStyle={{
							backgroundColor: 'transparent',
							//   borderTopWidth: 4,
							borderRadius: 0,
							//   borderBottomWidth: 4,
							borderColor: '#FF9848',
							opacity: 1,
						}}
					/>

					{/* <View
						className='absolute h-14 w-full border-y-2 border-[#FF9848]'
						style={{
							zIndex: -1,
							top: '50%',
							transform: [{ translateY: -(50 / 2) }],
							opacity: 0.75,
						}}
					/> */}
				</View>
				{/* Año */}
				<View className='relative flex-1 items-center'>
					{/* <View
						className='absolute h-14 w-full rounded-r-md border-y-2 border-[#FF9848]'
						style={{
							zIndex: -1,
							top: '50%',
							transform: [{ translateY: -(50 / 2) }],
							opacity: 0.75,
						}}
					/> */}

					<WheelPicker
						data={yearsData}
						value={selectedYear}
						onValueChanged={handleYearChange}
						itemTextStyle={{
							color: '#ffffff',
							fontSize: 20,
							paddingHorizontal: 15,
						}}
						overlayItemStyle={{
							backgroundColor: 'transparent',
							//   borderTopWidth: 4,
							borderRadius: 0,
							//   borderBottomWidth: 4,
							borderColor: '#FF9848',
							opacity: 1,
						}}
					/>
				</View>
			</View>
			<Button
				text={titleButton}
				onPress={() => handleSubmit()}
			/>
		</View>
	);
}
