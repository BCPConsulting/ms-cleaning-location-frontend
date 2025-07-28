export const formatISOToDate = (isoString: Date | null | string, showHour?: boolean) => {
	if (!isoString) {
		return `dd/mm/yyyy`;
	}

	const date = new Date(isoString);
	const day = date.getDate().toString().padStart(2, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const year = date.getFullYear();

	if (!showHour) {
		return `${day}/${month}/${year}`;
	}

	// Formato 12 horas con AM/PM
	const hour24 = date.getHours();
	const minute = date.getMinutes().toString().padStart(2, '0');

	const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
	const ampm = hour24 >= 12 ? 'PM' : 'AM';
	const hourFormatted = hour12.toString().padStart(2, '0');

	return `${day}/${month}/${year} ${hourFormatted}:${minute} ${ampm}`;
};
