function getWeekRange(dateString: string | undefined): {
    startOfWeek: string;
    endOfWeek: string;
} {
    const currentDate = new Date(
        dateString ?? new Date().toISOString().split('T')[0]
    );

    const dayOfWeek = currentDate.getDay();

    const startDiff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const endDiff = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;

    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() + startDiff);

    const endOfWeek = new Date(currentDate);
    endOfWeek.setDate(currentDate.getDate() + endDiff);

    const startOfWeekStr = startOfWeek.toISOString().split('T')[0];
    const endOfWeekStr = endOfWeek.toISOString().split('T')[0];

    return { startOfWeek: startOfWeekStr, endOfWeek: endOfWeekStr };
}

export { getWeekRange };
