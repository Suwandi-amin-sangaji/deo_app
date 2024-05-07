
import { formatDistance, format } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

function formatTanggal(tanggal) {
    const now = new Date();
    const inputDate = new Date(tanggal);
    const diffInDays = Math.round((now - inputDate) / (1000 * 60 * 60 * 24));
    if (diffInDays === 0) {
        return formatDistance(inputDate, now) + ' ago';
    } else if (diffInDays < 31) {
        return diffInDays + ' day ago';
    } else {
        return format(inputDate, 'EEEE, dd MMMM yyyy');
    }
}

export default formatTanggal;