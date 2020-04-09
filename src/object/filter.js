import forOwn from './forOwn';
import makeIterator from '../function/makeIterator_';

/**
 * Creates a new object with all the properties where the callback returns
 * true.
 */
function filterValues(obj, callback, thisObj) {
    callback = makeIterator(callback, thisObj);
    var output = {};
    forOwn(obj, function(value, key, obj) {
        if (callback(value, key, obj)) {
            output[key] = value;
        }
    });

    return output;
}
export default filterValues;
