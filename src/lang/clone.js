import kindOf from './kindOf';
import isPlainObject from './isPlainObject';
import mixIn from '../object/mixIn';

/**
 * Clone native types.
 */
function clone(val) {
    switch (kindOf(val)) {
        case 'Object':
            return cloneObject(val);
        case 'Array':
            return cloneArray(val);
        case 'RegExp':
            return cloneRegExp(val);
        case 'Date':
            return cloneDate(val);
        default:
            return val;
    }
}

function cloneObject(source) {
    if (isPlainObject(source)) {
        return mixIn({}, source);
    } else {
        return source;
    }
}

function cloneRegExp(r) {
    var flags = '';
    flags += r.multiline ? 'm' : '';
    flags += r.global ? 'g' : '';
    flags += r.ignoreCase ? 'i' : '';
    return new RegExp(r.source, flags);
}

function cloneDate(date) {
    return new Date(+date);
}

function cloneArray(arr) {
    return arr.slice();
}

export default clone;
