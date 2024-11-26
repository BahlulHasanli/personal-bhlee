interface TimeInterval {
	label: string;
	seconds: number;
}

export function timeAgo(date: string | number | Date): string {
	const now = new Date();
	const past = new Date(date);
	const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

	const timeIntervals: TimeInterval[] = [
		{ label: 'il', seconds: 31536000 },
		{ label: 'ay', seconds: 2592000 },
		{ label: 'həftə', seconds: 604800 },
		{ label: 'gün', seconds: 86400 },
		{ label: 'saat', seconds: 3600 },
		{ label: 'dəqiqə', seconds: 60 },
		{ label: 'saniyə', seconds: 1 }
	];

	for (const interval of timeIntervals) {
		const count: number = Math.floor(diffInSeconds / interval.seconds);
		if (count > 0) {
			return `${count} ${interval.label} əvvəl`;
		}
	}

	return 'indi';
}
