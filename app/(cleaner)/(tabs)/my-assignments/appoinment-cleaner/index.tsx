import { useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Button from '@/components/ui/button';
import ButtonBack from '@/components/ui/button-back';
import { CustomText, weight } from '@/components/ui/custom-text';
import { Screen } from '@/components/ui/screen';
import { CleaningStatus, PaymentType } from '@/core/shared/interfaces';
import { useChangeCompleted } from '@/presentation/appoinment/hooks/use-change-completed';
import { useChangeInProgress } from '@/presentation/appoinment/hooks/use-change-in-progress';
import { formatISOToDate } from '@/utils/format-iso-to-date';
import {
	Select,
	SelectTrigger,
	SelectInput,
	SelectIcon,
	SelectPortal,
	SelectBackdrop,
	SelectContent,
	SelectDragIndicator,
	SelectDragIndicatorWrapper,
	SelectItem,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ChevronDownIcon } from '@/components/ui/icon';

export default function AssignmentIdCleaner() {
	const { id, dateTime, assignmentStatus, cleanerId, detail, cleaningStatus, clientName, locationName, locationReference, cel } =
		useLocalSearchParams();
	const { toastError } = useToast();
	const [paymentType, setPaymentType] = useState<PaymentType | null>(null);
	const { ChangeInProgress } = useChangeInProgress();
	const { ChangeCompleted } = useChangeCompleted();

	const handleChangeCleaningStatus = async (cleaningStatus: CleaningStatus, appoinmentId: number) => {
		if (cleaningStatus === 'PENDING') {
			ChangeInProgress.mutate(appoinmentId);
			return;
		}

		if (cleaningStatus === 'IN_PROGRESS') {
			if (!paymentType) {
				toastError('Falta elegir el tipo de pago');
				return;
			}

			ChangeCompleted.mutate({
				appointmentId: appoinmentId,
				paymenType: paymentType,
			});
			return;
		}
	};

	return (
		<Screen>
			<View className='flex-1 px-4'>
				<View className='flex-row items-center mb-4'>
					<ButtonBack />
					<CustomText
						className='text-2xl px-4 text-neutral-100'
						variantWeight={weight.SemiBold}>
						Detalles del servicio
					</CustomText>
				</View>

				<View className='flex-row items-center justify-between mb-5'>
					<View
						className={`${
							cleaningStatus === 'PENDING' ? 'bg-warning/10' : 'bg-secondary/20'
						} rounded-3xl px-3 py-2 self-start`}>
						<CustomText
							className={`text-sm ${cleaningStatus === 'PENDING' ? 'text-warning' : 'text-secondary'}`}
							variantWeight={weight.Medium}>
							{cleaningStatus === 'PENDING' ? 'Pendiente' : cleaningStatus === 'IN_PROGRESS' && 'En Progreso'}
						</CustomText>
					</View>
				</View>

				<View className='mb-3'>
					<CustomText className='text-neutral-400 text-sm'>Nombre Cliente:</CustomText>
					<CustomText className='text-neutral-100'>{clientName}</CustomText>
				</View>

				<View className='mb-3'>
					<CustomText className='text-neutral-400 text-sm'>Nombre celular:</CustomText>
					<CustomText className='text-neutral-100'>{cel}</CustomText>
				</View>

				<View className='mb-3'>
					<CustomText className='text-neutral-400 text-sm'>Detalles:</CustomText>
					<CustomText className='text-neutral-100'>{detail}</CustomText>
				</View>

				<View className='mb-3'>
					<CustomText className='text-neutral-400 text-sm'>Nombre del lugar:</CustomText>
					<CustomText className='text-neutral-100'>{locationName}</CustomText>
				</View>

				<View className='mb-3'>
					<CustomText className='text-neutral-400 text-sm'>Lugar de referencia:</CustomText>
					<CustomText className='text-neutral-100'>{locationReference}</CustomText>
				</View>

				<View className='mb-3'>
					<CustomText className='text-neutral-400 text-sm'>Fecha:</CustomText>
					<CustomText className='text-neutral-100'>{formatISOToDate(dateTime as string, true)}</CustomText>
				</View>

				<View className='mb-3'>
					<Select onValueChange={(value) => setPaymentType(value as PaymentType)}>
						<SelectTrigger
							style={{ borderWidth: 0, backgroundColor: '#262626', borderRadius: 12 }}
							className='justify-between'
							size='md'>
							<SelectInput
								placeholder='Elegir metodo de pago'
								placeholderTextColor={'#8c8c90'}
							/>
							<SelectIcon
								className='mr-3'
								as={ChevronDownIcon}
							/>
						</SelectTrigger>
						<SelectPortal>
							<SelectBackdrop />
							<SelectContent>
								<SelectDragIndicatorWrapper>
									<SelectDragIndicator />
								</SelectDragIndicatorWrapper>
								<SelectItem
									label='Yape'
									value='YAPE'
								/>
								<SelectItem
									label='Plin'
									value='PLIN'
								/>
								<SelectItem
									label='Transferencia'
									value='TRANSFER'
								/>
								<SelectItem
									label='Efectivo'
									value='CASH'
								/>
							</SelectContent>
						</SelectPortal>
					</Select>
				</View>

				<Button
					text={
						cleaningStatus === 'PENDING'
							? 'Actualizar Estado'
							: cleaningStatus === 'IN_PROGRESS'
							? 'Terminar'
							: 'Actualizar Estado'
					}
					onPress={() => handleChangeCleaningStatus(cleaningStatus as CleaningStatus, +id)}
					isLoading={ChangeInProgress.isPending || ChangeCompleted.isPending}
					disabled={ChangeInProgress.isPending || ChangeCompleted.isPending}
				/>
			</View>
		</Screen>
	);
}
