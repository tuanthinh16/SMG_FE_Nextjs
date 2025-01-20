export class DateTimeHelper {
    /**
     * Converts a Date object to a time number in the format yyyyMMddHHmmss.
     * @param date - The Date object to convert.
     * @returns The time number as a string, or null if the conversion fails.
     */
    public static dateToTimeNumber(datetimeValue: string): string | null {
        const date = new Date(datetimeValue);
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        const second = date.getSeconds().toString().padStart(2, '0');

        const timeString = `${year}${month}${day}${hour}${minute}${second}`;
        return timeString.length >= 14 ? timeString : null;
    }

    /**
     * Converts a time number in the format yyyyMMddHHmmss to a Date object.
     * @param timeNumber - The time number as a string.
     * @returns The Date object, or null if the conversion fails.
     */
    public static timeNumberToDate(timeNumber: string): string | null {
        if (timeNumber.length !== 14) return null;

        const year = parseInt(timeNumber.slice(0, 4), 10);
        const month = parseInt(timeNumber.slice(4, 6), 10) - 1; // Months are 0-based in JavaScript
        const day = parseInt(timeNumber.slice(6, 8), 10);
        const hour = parseInt(timeNumber.slice(8, 10), 10);
        const minute = parseInt(timeNumber.slice(10, 12), 10);
        const second = parseInt(timeNumber.slice(12, 14), 10);

        const date = new Date(year, month, day, hour, minute, second);
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });
    }
}