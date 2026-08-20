export type MonthGrid = {
    year: number;
    month: number;
    /** Cases vides avant le 1er, semaine commençant le lundi. */
    firstWeekday: number;
    /** Clés « AAAA-MM-JJ » du mois, dans l'ordre. */
    days: string[];
};

/**
 * Géométrie d'un mois.
 *
 * Séparée du composant pour être vérifiable : les bugs de calendrier se logent
 * toujours dans les mois de 31 jours, les février bissextiles et les mois qui
 * commencent un dimanche.
 *
 * Tout est calculé en UTC. Avec l'heure locale, un mois basculerait d'un jour
 * pour les visiteurs situés à l'ouest de Greenwich.
 */
export function buildMonthGrid(month: string): MonthGrid {
    const [year, monthNumber] = month.split('-').map(Number) as [number, number];
    const daysInMonth = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();

    // `getUTCDay()` renvoie 0 pour dimanche : on décale pour une semaine qui
    // commence le lundi.
    const firstWeekday = (new Date(Date.UTC(year, monthNumber - 1, 1)).getUTCDay() + 6) % 7;

    const days = Array.from(
        { length: daysInMonth },
        (_, i) =>
            `${year}-${String(monthNumber).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`,
    );

    return { year, month: monthNumber, firstWeekday, days };
}

/** Décale un « AAAA-MM » de n mois, en gérant le passage d'année. */
export function shiftMonth(month: string, delta: number): string {
    const [year, monthNumber] = month.split('-').map(Number) as [number, number];
    const date = new Date(Date.UTC(year, monthNumber - 1 + delta, 1));
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

/** Les sept en-têtes de colonnes, du lundi au dimanche, dans la langue voulue. */
export function weekdayNames(locale: string): string[] {
    // 2024-01-01 était un lundi : il sert d'origine pour nommer les colonnes.
    return Array.from({ length: 7 }, (_, i) =>
        new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' }).format(
            new Date(Date.UTC(2024, 0, 1 + i)),
        ),
    );
}
