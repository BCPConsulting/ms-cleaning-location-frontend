import * as Yup from 'yup';

const validationUpdateAppoinment = Yup.object().shape({
	dateTime: Yup.string()
		.nullable()
		.test('format-if-provided', 'El formato debe ser dd/mm/yyyy o dd/mm/yyyy hh:mm', function (value) {
			// Si está vacío o null, es válido
			if (!value || value.trim() === '') return true;

			// Permitir tanto dd/mm/yyyy como dd/mm/yyyy hh:mm
			return /^(\d{2})\/(\d{2})\/(\d{4})(\s\d{2}:\d{2})?$/.test(value);
		})
		.test('valid-date-if-provided', 'Fecha inválida', function (value) {
			if (!value || value.trim() === '') return true;

			// Extraer solo la parte de fecha para validación
			const dateOnly = value.split(' ')[0];
			const match = dateOnly.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
			if (!match) return false;

			const [, day, month, year] = match;
			const dayNum = parseInt(day, 10);
			const monthNum = parseInt(month, 10);
			const yearNum = parseInt(year, 10);

			const date = new Date(yearNum, monthNum - 1, dayNum);

			return date.getDate() === dayNum && date.getMonth() === monthNum - 1 && date.getFullYear() === yearNum;
		})
		.test('valid-time-if-provided', 'Hora inválida', function (value) {
			if (!value || value.trim() === '') return true;

			// Si incluye hora, validar formato HH:MM
			if (value.includes(' ')) {
				const timePart = value.split(' ')[1];
				const timeMatch = timePart.match(/^(\d{2}):(\d{2})$/);
				if (!timeMatch) return false;

				const [, hour, minute] = timeMatch;
				const hourNum = parseInt(hour, 10);
				const minuteNum = parseInt(minute, 10);

				return hourNum >= 0 && hourNum <= 23 && minuteNum >= 0 && minuteNum <= 59;
			}

			return true;
		})
		.test('future-date-if-provided', 'La fecha debe ser mayor al día de hoy', function (value) {
			if (!value || value.trim() === '') return true;

			const dateOnly = value.split(' ')[0];
			const match = dateOnly.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
			if (!match) return false;

			const [, day, month, year] = match;
			const inputDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));

			const nowUTC = new Date();
			const peruTime = new Date(nowUTC.getTime() - 5 * 60 * 60 * 1000);
			const todayPeru = new Date(peruTime.getFullYear(), peruTime.getMonth(), peruTime.getDate());

			return inputDate >= todayPeru;
		}),
	coordinates: Yup.string(),
	price: Yup.number().required('Se requiere este campo'),
	detail: Yup.string().required('Se requiere este campo'),
	cleanerId: Yup.string().required('Se requiere este campo'),
	locationName: Yup.string().required('Se requiere este campo'),
	locationReference: Yup.string(),
	clientName: Yup.string().required('Se requiere este campo'),
});

export default validationUpdateAppoinment;
