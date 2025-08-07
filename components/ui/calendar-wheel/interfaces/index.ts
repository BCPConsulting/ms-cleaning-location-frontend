export interface DateItemType {
	value: number;
	label: string;
}

export interface DateChangeData {
	date: Date;
	formatted: string;
	day: number;
	month: number;
	monthName: string;
	year: number;
	formattedReversedSlash: string;
}

export interface WheelPickerChangeEvent {
	item: DateItemType;
}

export interface WheelDatePickerProps {
	initialDate?: Date;
	onSubmit?: (dateData: DateChangeData) => void;
	showLabel?: boolean;
	title: string;
	titleButton?: string;
}
