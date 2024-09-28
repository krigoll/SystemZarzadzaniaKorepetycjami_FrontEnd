function getWeekRange(dateString: string | undefined): { startOfWeek: string, endOfWeek: string } {
    const currentDate = new Date(dateString ?? new Date().toISOString().split('T')[0]);

    // ZnajdŸ dzieñ tygodnia (0 = Niedziela, 1 = Poniedzia³ek, ..., 6 = Sobota)
    const dayOfWeek = currentDate.getDay();

    // Je¿eli `dayOfWeek` wynosi 0 (niedziela), to traktujemy to jako 7, aby liczyæ od poniedzia³ku
    const startDiff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const endDiff = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;

    // Oblicz datê pocz¹tku tygodnia (poniedzia³ek)
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() + startDiff);

    // Oblicz datê koñca tygodnia (niedziela)
    const endOfWeek = new Date(currentDate);
    endOfWeek.setDate(currentDate.getDate() + endDiff);

    // Sformatuj daty na YYYY-MM-DD
    const startOfWeekStr = startOfWeek.toISOString().split('T')[0];
    const endOfWeekStr = endOfWeek.toISOString().split('T')[0];

    return { startOfWeek: startOfWeekStr, endOfWeek: endOfWeekStr };
}

export { getWeekRange }
