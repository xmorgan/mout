import some from '../array/some';

const datePatterns = [
    /^([0-9]{4})$/, // YYYY
    /^([0-9]{4})-([0-9]{2})$/, // YYYY-MM (YYYYMM not allowed)
    /^([0-9]{4})-?([0-9]{2})-?([0-9]{2})$/, // YYYY-MM-DD or YYYYMMDD
];
const ORD_DATE = /^([0-9]{4})-?([0-9]{3})$/; // YYYY-DDD

const timePatterns = [
    /^([0-9]{2}(?:\.[0-9]*)?)$/, // HH.hh
    /^([0-9]{2}):?([0-9]{2}(?:\.[0-9]*)?)$/, // HH:MM.mm
    /^([0-9]{2}):?([0-9]{2}):?([0-9]{2}(\.[0-9]*)?)$/, // HH:MM:SS.ss
];

const DATE_TIME = /^(.+)T(.+)$/;
const TIME_ZONE = /^(.+)([+\-])([0-9]{2}):?([0-9]{2})$/;

function matchAll(str, patterns) {
    let match;
    const found = some(patterns, function(pattern) {
        return !!(match = pattern.exec(str));
    });

    return found ? match : null;
}

function getDate(year, month, day) {
    const date = new Date(Date.UTC(year, month, day));

    // Explicitly set year to avoid Date.UTC making dates < 100 relative to
    // 1900
    date.setUTCFullYear(year);

    const valid =
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month &&
        date.getUTCDate() === day;
    return valid ? +date : NaN;
}

function parseOrdinalDate(str) {
    const match = ORD_DATE.exec(str);
    if (match) {
        const year = +match[1];
        const day = +match[2];
        const date = new Date(Date.UTC(year, 0, day));

        if (date.getUTCFullYear() === year) {
            return +date;
        }
    }

    return NaN;
}

function parseDate(str) {
    let match; let year; let month; let day;

    match = matchAll(str, datePatterns);
    if (match === null) {
        // Ordinal dates are verified differently.
        return parseOrdinalDate(str);
    }

    year = match[1] === void 0 ? 0 : +match[1];
    month = match[2] === void 0 ? 0 : +match[2] - 1;
    day = match[3] === void 0 ? 1 : +match[3];

    return getDate(year, month, day);
}

function getTime(hr, min, sec) {
    const valid =
        (hr < 24 && hr >= 0 && min < 60 && min >= 0 && sec < 60 && min >= 0) ||
        (hr === 24 && min === 0 && sec === 0);
    if (!valid) {
        return NaN;
    }

    return ((hr * 60 + min) * 60 + sec) * 1000;
}

function parseOffset(str) {
    let match;
    if (str.charAt(str.length - 1) === 'Z') {
        str = str.substring(0, str.length - 1);
    } else {
        match = TIME_ZONE.exec(str);
        if (match) {
            const hours = +match[3];
            const minutes = match[4] === void 0 ? 0 : +match[4];
            let offset = getTime(hours, minutes, 0);

            if (match[2] === '-') {
                offset *= -1;
            }

            return {offset: offset, time: match[1]};
        }
    }

    // No time zone specified, assume UTC
    return {offset: 0, time: str};
}

function parseTime(str) {
    let match;
    let offset = parseOffset(str);

    str = offset.time;
    offset = offset.offset;
    if (isNaN(offset)) {
        return NaN;
    }

    match = matchAll(str, timePatterns);
    if (match === null) {
        return NaN;
    }

    const hours = match[1] === void 0 ? 0 : +match[1];
    const minutes = match[2] === void 0 ? 0 : +match[2];
    const seconds = match[3] === void 0 ? 0 : +match[3];

    return getTime(hours, minutes, seconds) - offset;
}

/**
 * Parse an ISO8601 formatted date string, and return a Date object.
 */
function parseISO8601(str) {
    const match = DATE_TIME.exec(str);
    if (!match) {
        // No time specified
        return parseDate(str);
    }

    return parseDate(match[1]) + parseTime(match[2]);
}

export default parseISO8601;