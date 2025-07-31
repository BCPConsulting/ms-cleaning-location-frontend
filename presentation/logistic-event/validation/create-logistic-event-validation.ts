import * as Yup from 'yup';

const validationCreateLogisticEvent = Yup.object().shape({
	dateTime: Yup.string()
		.required('Se requiere este campo')
		.matches(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/, 'El formato debe ser dd/mm/yyyy hh:mm')
		.test('valid-date', 'Fecha inválida', function (value) {
			if (!value) return false;

			const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/);
			if (!match) return false;

			const [, day, month, year, hour, minute] = match;
			const dayNum = parseInt(day, 10);
			const monthNum = parseInt(month, 10);
			const yearNum = parseInt(year, 10);
			const hourNum = parseInt(hour, 10);
			const minuteNum = parseInt(minute, 10);

			const date = new Date(yearNum, monthNum - 1, dayNum, hourNum, minuteNum);

			return (
				date.getDate() === dayNum &&
				date.getMonth() === monthNum - 1 &&
				date.getFullYear() === yearNum &&
				date.getHours() === hourNum &&
				date.getMinutes() === minuteNum
			);
		})
		.test('future-date', 'La fecha debe ser mayor al día de hoy', function (value) {
			if (!value) return false;

			const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/);
			if (!match) return false;

			const [, day, month, year, hour, minute] = match;
			const inputDate = new Date(
				parseInt(year, 10),
				parseInt(month, 10) - 1,
				parseInt(day, 10),
				parseInt(hour, 10),
				parseInt(minute, 10)
			);

			const today = new Date();
			today.setHours(0, 0, 0, 0); // Resetear a inicio del día

			return inputDate > today;
		}),
	eventType: Yup.string().required('Se requiere este campo'),
	locationName: Yup.string().required('Se requiere este campo'),
	locationReference: Yup.string().required('Se requiere este campo'),
	cleanerId: Yup.string().required('Se requiere este campo'),
});

export default validationCreateLogisticEvent;
