import React, { useState, useCallback, useMemo, useRef } from 'react';
import { View, FlatList, Pressable, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Formik, FormikHelpers } from 'formik';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { CustomText, weight } from '@/components/ui/custom-text';
import { Screen } from '@/components/ui/screen';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useSignUp } from '@/presentation/auth/hooks/use-sign-up';
import { useGetAllCleaners } from '@/presentation/user/hooks/use-get-all-cleaners';
import { SignUpRequest, User } from '@/core/auth/interfaces';
import { useKeyboard } from '@/hooks/use-key-board';
import validationSchemaSignUpCleaner from '@/presentation/auth/validation/validation-schema-signup-cleaner';
import { useToast } from '@/hooks/use-toast';
import { useDeleteUser } from '@/presentation/user/hooks/use-delete-user';
import { useUpdateUser } from '@/presentation/user/hooks/use-update-user';
import { UpdateUserRequest } from '@/core/user/interfaces';

const initialValues: SignUpRequest = {
	password: '',
	phone: '',
	role: 'CLEANER',
	username: '',
};

export default function OperatorsManagementScreen() {
	const bottomSheetRef = useRef<BottomSheet>(null);
	const [currentIndex, setCurrentIndex] = useState(1);
	const [isEditMode, setIsEditMode] = useState(false);
	const [editingUser, setEditingUser] = useState<User | null>(null);
	const { isKeyboardVisible, dismissKeyboard } = useKeyboard();
	const { SignUp } = useSignUp();
	const { GetCleaners } = useGetAllCleaners();
	const { DeleteUser } = useDeleteUser();
	const { UpdateUser } = useUpdateUser();
	const { toastSuccess } = useToast();

	const snapPoints = useMemo(() => ['100%'], []);

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

	const handleOpenCreateModal = useCallback(() => {
		setIsEditMode(false);
		setEditingUser(null);
		bottomSheetRef.current?.expand();
	}, []);

	const handleOpenEditModal = useCallback((user: User) => {
		setIsEditMode(true);
		setEditingUser(user);
		bottomSheetRef.current?.expand();
	}, []);

	const handleCloseModal = useCallback(() => {
		setIsEditMode(false);
		setEditingUser(null);
		bottomSheetRef.current?.close();
	}, []);

	const handleCreateCleaner = useCallback(
		(values: SignUpRequest, formik: FormikHelpers<SignUpRequest>) => {
			SignUp.mutateAsync(values, {
				onSuccess: () => {
					formik.resetForm();
					handleCloseModal();
					toastSuccess('Operario creado exitosamente');
				},
				onError: (error) => {
					console.error('Error creating cleaner:', error);
				},
			});
		},
		[handleCloseModal, toastSuccess]
	);

	// ✅ Función para actualizar operario
	const handleUpdateCleaner = useCallback(
		(values: UpdateUserRequest, formik: FormikHelpers<any>) => {
			if (!editingUser?.id) return;

			const updateData: UpdateUserRequest = {
				id: editingUser.id,
				username: values.username,
				password: values.password,
				phone: values.phone,
				role: 'CLEANER',
			};

			UpdateUser.mutateAsync(updateData, {
				onSuccess: () => {
					formik.resetForm();
					handleCloseModal();
				},
				onError: (error) => {
					console.error('Error updating cleaner:', error);
				},
			});
		},
		[editingUser, UpdateUser, handleCloseModal, toastSuccess]
	);

	// ✅ Función que maneja submit (crear o actualizar)
	const handleSubmit = useCallback(
		(values: any, formik: FormikHelpers<any>) => {
			if (isEditMode) {
				handleUpdateCleaner(values, formik);
			} else {
				handleCreateCleaner(values, formik);
			}
		},
		[isEditMode, handleUpdateCleaner, handleCreateCleaner]
	);

	const handleDelete = useCallback(
		(cleaner: User) => {
			if (cleaner.id) {
				DeleteUser.mutate(cleaner.id, {
					onSuccess: () => {
						toastSuccess('Operario eliminado exitosamente');
					},
				});
			}
		},
		[DeleteUser, toastSuccess]
	);

	const keyExtractor = useCallback((item: User, index: number) => {
		return item.id?.toString() ?? index.toString();
	}, []);

	// ✅ Valores iniciales dinámicos según el modo
	const getInitialValues = useMemo(() => {
		if (isEditMode && editingUser) {
			return {
				username: editingUser.username || '',
				phone: editingUser.phone || '',
				password: '', // No mostrar contraseña actual por seguridad
				role: editingUser.role || 'CLEANER',
				status: editingUser.status || 'ACTIVE',
			};
		}
		return initialValues;
	}, [isEditMode, editingUser]);

	const renderOperatorCard = useCallback(
		({ item }: { item: User }) => {
			return (
				<View className='mx-4 mb-4'>
					<View className='bg-neutral-900/50 border border-neutral-800/50 rounded-2xl p-5 relative'>
						<View className='absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-[#10b981] to-[#059669] rounded-l-2xl' />

						<View className='flex-row items-center gap-4 mb-4'>
							<View className='flex-1'>
								<CustomText
									className='text-white text-lg mb-1 capitalize'
									variantWeight={weight.SemiBold}>
									{item.username}
								</CustomText>

								{/* ✅ Mostrar teléfono si existe */}
								{item.phone && <CustomText className='text-neutral-400 text-sm mb-2'>📱 {item.phone}</CustomText>}

								<View className='flex-row gap-2'>
									<View className='bg-blue-600/20 border border-blue-600/30 px-3 py-1 rounded-full flex-row items-center gap-1'>
										<Ionicons
											name='person'
											size={10}
											color='#60a5fa'
										/>
										<CustomText className='text-blue-400 text-xs'>
											{item.role === 'CLEANER' ? 'OPERARIO' : item.role}
										</CustomText>
									</View>

									<View
										className={`px-3 py-1 rounded-full flex-row items-center gap-1 ${
											item.status === 'ACTIVE'
												? 'bg-green-600/20 border border-green-600/30'
												: 'bg-gray-600/20 border border-gray-600/30'
										}`}>
										<Ionicons
											name='checkmark-circle'
											size={10}
											color={item.status === 'ACTIVE' ? '#10b981' : '#9ca3af'}
										/>
										<CustomText className={`text-xs ${item.status === 'ACTIVE' ? 'text-green-400' : 'text-gray-400'}`}>
											{item.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
										</CustomText>
									</View>
								</View>
							</View>
						</View>

						{/* ✅ Botones de acción: Editar y Eliminar */}
						<View className='flex-row gap-2'>
							<Pressable
								onPress={() => handleOpenEditModal(item)}
								className='flex-1 bg-blue-600/20 border border-blue-600/30 rounded-xl p-3 flex-row items-center justify-center gap-2'>
								<Ionicons
									name='create-outline'
									size={16}
									color='#60a5fa'
								/>
								<CustomText className='text-blue-400 text-sm'>Editar</CustomText>
							</Pressable>

							<Pressable
								onPress={() => handleDelete(item)}
								className='flex-1 bg-red-600/20 border border-red-600/30 rounded-xl p-3 flex-row items-center justify-center gap-2'>
								<Ionicons
									name='trash-outline'
									size={16}
									color='#ef4444'
								/>
								<CustomText className='text-red-400 text-sm'>Eliminar</CustomText>
							</Pressable>
						</View>
					</View>
				</View>
			);
		},
		[handleOpenEditModal, handleDelete]
	);

	const focusHook = useCallback((callback: () => void) => {
		useFocusEffect(callback);
	}, []);

	return (
		<Screen isSafeAreaInsets={false}>
			<View className='flex-1 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950'>
				<View className='p-4 bg-neutral-900/50 border-b border-neutral-800/50 flex-row items-center gap-3'>
					{/* ✅ Botón para crear operario */}
					<Button
						onPress={handleOpenCreateModal}
						className='flex-row gap-3'>
						<Ionicons
							name='add'
							size={16}
							color='white'
						/>
						<CustomText
							className='text-white text-sm'
							variantWeight={weight.SemiBold}>
							Agregar
						</CustomText>
					</Button>
				</View>

				<FlatList
					data={GetCleaners.data?.data ?? []}
					keyExtractor={keyExtractor}
					renderItem={renderOperatorCard}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ paddingVertical: 16 }}
					ListEmptyComponent={
						<View className='items-center justify-center py-20'>
							<Ionicons
								name='people-outline'
								size={64}
								color='#525252'
							/>
							<CustomText className='text-neutral-500 text-lg mt-4'>No se encontraron operarios</CustomText>
						</View>
					}
				/>
			</View>

			{/* ✅ BottomSheet con modo dinámico */}
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<BottomSheet
					ref={bottomSheetRef}
					index={-1}
					snapPoints={snapPoints}
					enablePanDownToClose={true}
					handleIndicatorStyle={{ backgroundColor: '#fff' }}
					backgroundStyle={{ backgroundColor: '#121315' }}
					onChange={handleSheetChanges}
					enableContentPanningGesture={true}
					enableHandlePanningGesture={true}
					enableDynamicSizing={false}
					keyboardBehavior='fillParent'>
					<KeyboardAvoidingView
						style={{ flex: 1 }}
						behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
						<BottomSheetScrollView
							style={{ backgroundColor: '#121315', position: 'relative', padding: 12 }}
							focusHook={focusHook}
							nestedScrollEnabled={true}
							contentContainerStyle={{
								paddingBottom: Platform.select({ ios: 300, android: 260 }),
							}}>
							{/* ✅ Header dinámico del modal */}
							<View className='mb-6 border-b border-neutral-800/50 pb-4'>
								<View className='flex-row items-center justify-between'>
									<View>
										<CustomText
											className='text-white text-xl'
											variantWeight={weight.Bold}>
											{isEditMode ? 'Editar Operario' : 'Agregar Nuevo Operario'}
										</CustomText>
										<CustomText className='text-neutral-400 text-sm mt-1'>
											{isEditMode ? `Editando: ${editingUser?.username}` : 'Complete los datos del nuevo operario'}
										</CustomText>
									</View>
									<Pressable
										onPress={handleCloseModal}
										className='p-2'>
										<Ionicons
											name='close'
											size={24}
											color='#a3a3a3'
										/>
									</Pressable>
								</View>
							</View>

							{/* ✅ Formulario con valores dinámicos */}
							<Formik
								initialValues={getInitialValues}
								validationSchema={validationSchemaSignUpCleaner}
								enableReinitialize={true} // ✅ Importante para actualizar valores al cambiar modo
								onSubmit={handleSubmit}>
								{({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
									<View className='space-y-4'>
										<View className='mb-4'>
											<Input
												label='Nombre'
												placeholder='Ingrese el nombre completo'
												value={values.username}
												onChangeText={handleChange('username')}
												onBlur={handleBlur('username')}
												name='username'
												error={!!(touched.username && errors.username)}
											/>
										</View>

										<View className='mb-4'>
											<Input
												label='Celular'
												value={values.phone}
												placeholder='999999999'
												keyboardType='phone-pad'
												onChangeText={handleChange('phone')}
												onBlur={handleBlur('phone')}
												name='phone'
												error={!!(touched.phone && errors.phone)}
											/>
										</View>

										<View className='mb-4'>
											<Input
												label='Contraseña'
												value={values.password}
												placeholder='Escribir contraseña'
												secureTextEntry={true}
												onChangeText={handleChange('password')}
												onBlur={handleBlur('password')}
												name='password'
												error={!!(touched.password && errors.password)}
											/>
										</View>

										<View className=''>
											<Button
												onPress={() => handleSubmit()}
												isLoading={SignUp.isPending || UpdateUser.isPending}
												disabled={SignUp.isPending || UpdateUser.isPending}
												className='flex-1'>
												<CustomText
													className='text-white'
													variantWeight={weight.SemiBold}>
													Guardar Operario
												</CustomText>
											</Button>
										</View>
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
