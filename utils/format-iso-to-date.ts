export const formatISOToDate = (isoString: Date | null | string, showHour?: boolean) => {
	if (!isoString) {
		return `dd/mm/yyyy`;
	}

	const date = new Date(isoString);
	const day = date.getDate().toString().padStart(2, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const year = date.getFullYear();
	const hour = date.getHours();
	const minute = date.getMinutes();

	if (!showHour) {
		return `${day}/${month}/${year}`;
	}
	return `${day}/${month}/${year} ${hour}:${minute}`;
};
