import { memo } from 'react';
import { Dimensions, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

const dimensions = Dimensions.get('screen');

const data = [
	{ value: 0, dataPointText: '0' },
	{ value: 20, dataPointText: '20' },
	{ value: 18, dataPointText: '18' },
	{ value: 40, dataPointText: '40' },
	{ value: 36, dataPointText: '36' },
	{ value: 60, dataPointText: '60' },
	{ value: 54, dataPointText: '54' },
	{ value: 70, dataPointText: '70' },
	{ value: 100, dataPointText: '100' },
];
{
}

const CustomChart = memo(() => {
	return (
		<View className='text-neutral-500'>
			<LineChart
				areaChart
				curved
				data={data}
				width={dimensions.width - 16}
				height={300}
				adjustToWidth
				initialSpacing={10}
				color='#006eee' // Color de la linea
				dataPointsColor='#93c5fd' // Color de los puntos
				startFillColor='#006eee'
				startOpacity={0.2}
				endOpacity={0.1}
				thickness={3}
				hideRules
				// yAxisTextNumberOfLines={5}
				yAxisColor='transparent'
				xAxisColor='transparent'
				// overflowTop={20}
				// overflowBottom={20}
				focusEnabled
				yAxisLabelPrefix='s/'
				// showTextOnFocus
				xAxisLength={10}
				hideYAxisText
				roundToDigits={0}
				// yAxisTextStyle={{
				// 	fontSize: 11,
				// 	color: '#737373',
				// 	textAlign: 'center',
				// 	width: '100%',
				// 	fontFamily: 'PoppinsRegular',
				// }}
				yAxisThickness={0}
				// yAxisLabelWidth={60}
				dataPointLabelShiftY={0}
				dataPointsHeight={15}
				focusedDataPointColor={'#172554'}
				dataPointsWidth={15}
				// pointerConfig={{
				// 	pointerStripHeight: 300,
				// 	pointerStripColor: '#454545',
				// 	pointerStripWidth: 1,
				// 	pointerColor: '#FFFFFF',
				// 	radius: 8,
				// 	pointerLabelWidth: 120,
				// 	pointerLabelHeight: 0,
				// 	pointerVanishDelay: 20000,
				// 	strokeDashArray: [5, 5],
				// 	activatePointersOnLongPress: true,
				// 	autoAdjustPointerLabelPosition: true,
				// 	persistPointer: true,
				// }}
				// dataPointLabelComponent={(items: any) => {
				// 	return (
				// 		<View
				// 			style={{
				// 				height: 30,
				// 				width: '100%',
				// 				justifyContent: 'center',
				// 				marginTop: -30,
				// 				marginLeft: -10,
				// 				borderRadius: 10,
				// 			}}>
				// 			<CustomText
				// 				styleCustom={{
				// 					color: 'white',
				// 					fontSize: 14,
				// 					textAlign: 'center',
				// 					justifyContent: 'center',
				// 					marginVertical: 'auto',
				// 				}}>
				// 				{items.value}
				// 			</CustomText>
				// 		</View>
				// 	);
				// }}
			/>
		</View>
	);
});

export default CustomChart;
