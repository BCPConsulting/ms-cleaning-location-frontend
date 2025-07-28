import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { drawerItems } from './drawer-items';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomText, weight } from '../ui/custom-text';

export function CustomDrawerContent(props: DrawerContentComponentProps) {
	const insets = useSafeAreaInsets();

	return (
		<DrawerContentScrollView
			{...props}
			contentContainerStyle={{ paddingTop: insets.top + 10 }}>
			<DrawerItemList {...props} />
			{/* {drawerItems.map((item) => {
				const { navigation, state } = props;
				const isActive = state?.routeNames[state.index] === item.route;

				return (
					<View key={item.route}>
						<DrawerItem
							focused={isActive}
							label={({ focused, color }) => {
								return (
									<View className='flex flex-col'>
										<CustomText
											variantWeight={weight.Medium}
											className={`${focused ? 'text-black' : 'text-neutral-300'}`}>
											{item.label}
										</CustomText>
									</View>
								);
							}}
							icon={({ color, size, focused }) => (
								<Ionicons
									name={item.icon as any}
									size={20}
									color={`${focused ? 'black' : '#d4d4d4'}`}
								/>
							)}
							onPress={() => navigation.navigate(item.route)}
							style={{
								backgroundColor: isActive ? '#FF9848' : 'transparent',
								borderRadius: 12,
							}}
						/>
					</View>
				);
			})} */}
		</DrawerContentScrollView>
	);
}
