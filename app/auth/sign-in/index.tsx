import Button from '@/components/ui/button';
import { CustomText } from '@/components/ui/custom-text';
import Input from '@/components/ui/input';
import { Screen } from '@/components/ui/screen';
import { SignInRequest } from '@/core/auth/interfaces';
import { useSignIn } from '@/presentation/auth/hooks/use-sign-in';
import validationSchemaSignin from '@/presentation/auth/validation/validation-schema-signin';
import { Ionicons } from '@expo/vector-icons';
import { Formik, FormikHelpers } from 'formik';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

const initialValue: SignInRequest = {
	username: '',
	password: '',
};

export default function SignIn() {
	const [showPassword, setShowPassword] = useState(false);
	const { SignIn } = useSignIn();

	const handleSubmit = (values: SignInRequest, formik: FormikHelpers<SignInRequest>) => {
		SignIn.mutate({
			username: values.username,
			password: values.password,
		});
	};

	return (
		<Screen>
			<View className='flex-1 px-4'>
				<View>
					<CustomText className='text-neutral-100 text-center'>Ingresar Plataforma</CustomText>
				</View>

				<View className='flex-1'>
					<Formik
						initialValues={initialValue}
						onSubmit={(values, formik) => handleSubmit(values, formik)}
						validationSchema={validationSchemaSignin}>
						{({ handleChange, handleBlur, values, handleSubmit, errors, touched }) => (
							<View className='flex-1'>
								<View className='mb-3'>
									<Input
										label='Usuario'
										autoCapitalize='none'
										placeholder='Ingresar nombre usuario'
										keyboardType='email-address'
										value={values.username}
										onChangeText={handleChange('username')}
										IconLeft={
											<Ionicons
												name={'mail-outline'}
												size={24}
												color={'#8C8C99'}
												style={{ marginRight: 12, marginLeft: 12 }}
											/>
										}
									/>
								</View>

								<View className='mb-8'>
									<Input
										label='Contraseña'
										placeholder='Contraseña'
										secureTextEntry={!showPassword}
										value={values.password}
										onChangeText={handleChange('password')}
										autoCapitalize='none'
										IconRight={
											<Pressable onPress={() => setShowPassword(!showPassword)}>
												<Ionicons
													name={!showPassword ? 'eye-outline' : 'eye-off-outline'}
													size={24}
													color='white'
													className='w-full'
												/>
											</Pressable>
										}
										IconLeft={
											<Ionicons
												name={'lock-closed-outline'}
												size={24}
												color={'#8C8C99'}
												style={{ marginRight: 12, marginLeft: 12 }}
											/>
										}
									/>
								</View>

								<Button
									disabled={SignIn.isPending}
									isLoading={SignIn.isPending}
									variant='solid'
									text='Ingresar'
									onPress={() => handleSubmit()}
								/>
							</View>
						)}
					</Formik>
				</View>
			</View>
		</Screen>
	);
}
